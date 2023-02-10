import React from "react";
import {
  Text,
  StatusBar,
  Image,
  Box,
  ScrollView,
  Alert,
  Pressable,
  IconButton,
  Toast,
  HStack,
  Avatar,
  FlatList,
  Spacer,
  Icon,
  Center,
} from "native-base";
import { Linking } from "react-native";
import { MovieCard, Header } from "../components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

const imgUrl = "https://image.tmdb.org/t/p/w500";
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "your api key";

class DetailsMovie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trailer: [],
      iconChange: true,
      details: [],
      list: [],
      all: [],
      cast: [],
      movie: [],
    };
  }

  TrailerMovie = () => {
    const { route } = this.props;
    const data = route.params.data;
    fetch(`${baseUrl}/movie/${data.id}/videos?api_key=${apiKey}&language=en-US`)
      .then((response) => response.json())
      .then((json) => this.setState({ trailer: json.results }))
      .catch((error) => console.error(error));
  };

  getDetails = () => {
    const { route } = this.props;
    const data = route.params.data;
    fetch(`${baseUrl}/movie/${data.id}?api_key=${apiKey}&language=en-US`)
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          details: json.genres,
          all: data,
        })
      )
      .catch((error) => console.error(error));
  };

  getCast = () => {
    const { route } = this.props;
    const data = route.params.data;
    fetch(
      `${baseUrl}/movie/${data.id}/credits?api_key=${apiKey}&language=en-US`
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          cast: json.cast,
        })
      )
      .catch((error) => console.error(error));
  };

  getRecomendation = () => {
    const { route } = this.props;
    const data = route.params.data;
    fetch(
      `${baseUrl}/movie/${data.id}/recommendations?api_key=${apiKey}&language=en-US&region=ID`
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          movie: json.results,
        })
      )
      .catch((error) => console.error(error));
  };

  getFavorite = async () => {
    try {
      const value = await AsyncStorage.getItem("@favorite-list");
      if (value !== null) {
        this.setState({ list: JSON.parse(value) });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.TrailerMovie();
    this.getDetails();
    this.getFavorite();
    this.getCast();
    this.getRecomendation();
  }

  renderCast = ({ item }) => {
    return (
      <Box alignItems={"center"} justifyContent={"center"}>
        <Avatar
          mr={2}
          size={"60px"}
          source={
            item.profile_path
              ? { uri: `${imgUrl}/${item.profile_path}` }
              : require("../assets/no_profile.png")
          }
          alt="Avatar"
        >
          AJ
        </Avatar>
        <Spacer />
        <Text
          numberOfLines={2}
          color={"#FFF"}
          fontSize={10}
          w={20}
          textAlign={"center"}
        >
          {item.name}
        </Text>
      </Box>
    );
  };

  renderMovie = ({ item }) => {
    const { navigation } = this.props;
    return (
      <MovieCard
        title={item.title}
        rate={item.vote_average}
        source={
          item.poster_path
            ? { uri: `${imgUrl}/${item.poster_path}` }
            : require("../assets/no_image.png")
        }
        width={"145"}
        height={280}
        color={"#FFFF"}
        rateIcon={true}
        onPress={() => navigation.push("DetailsMovie", { data: item })}
        bgColor={"#150050"}
        isPress={{ bgColor: "trueGray.500" }}
      />
    );
  };

  handleAddMovie = (data) => {
    const prevList = this.state.list;
    this.setState(
      {
        list: [
          ...prevList,
          {
            title: data.title,
            id: data.id,
            backdrop_path: data.backdrop_path,
            poster_path: data.poster_path,
            overview: data.overview,
            vote_average: data.vote_average,
          },
        ],
      },
      () => {
        try {
          AsyncStorage.setItem(
            "@favorite-list",
            JSON.stringify(this.state.list)
          );
        } catch (e) {
          console.error(e.message);
        }
      }
    );
  };

  handleDeleteMovie = (index) => {
    const deletedList = index;
    this.setState({ list: deletedList }, () => {
      try {
        AsyncStorage.setItem("@favorite-list", JSON.stringify(this.state.list));
      } catch (e) {
        console.error(e.message);
      }
    });
  };

  OpenUrl = async (url) => {
    const isSupport = await Linking.canOpenURL(url);
    if (isSupport) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this url: ${url}`);
    }
  };

  render() {
    const { trailer, details, list, all, cast, movie } = this.state;
    const { route } = this.props;
    const data = route.params.data;
    let linkKu = "";
    let obj = trailer.find((link) => {
      if (link.type === "Trailer") {
        linkKu = link.key;

        return true;
      }
    });
  
    return (
      <ScrollView bgColor={"#282A3A"}>
        <StatusBar backgroundColor="#000000" />
        <Header title={data.title} backButton={true} />
        <Box flex={1} mx={2} my={2}>
          <Box bgColor={"#282A3A"} alignItems={"center"}>
            <Image
              source={
                data.backdrop_path
                  ? { uri: `${imgUrl}/${data.backdrop_path}` }
                  : require("../assets/noimage.png")
              }
              w={"100%"}
              h={"250"}
              borderRadius={10}
              bgColor={"#FFF"}
              alt="News"
              resizeMode="cover"
              alignSelf={"center"}
            />
          </Box>

          <Box
            mt={2}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Pressable
              flexDirection={"row"}
              _pressed={{ bg: "trueGray.500" }}
              justifyContent={"center"}
              bg={"#474E68"}
              h={"35px"}
              w={"30%"}
              px={3}
              rounded="full"
              alignItems={"center"}
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/watch?v=${linkKu}`);
              }}
            >
              <Ionicons name="play-circle" size={28} color="#fff" />
              <Text ml={2} color={"#FFF"}>
                Play Trailer
              </Text>
            </Pressable>

            {list.some((item) => item.id === all.id) ? (
              <IconButton
                onPress={() => {
                  Toast.show({ description: "remove from your wishlist" }),
                    this.handleDeleteMovie(
                      this.state.list.filter((x) => x.id !== all.id)
                    );
                }}
                icon={<Ionicons name="bookmark" size={28} color="#fff" />}
              />
            ) : (
              <IconButton
                onPress={() => {
                  Toast.show({ description: "add to your wishlist" }),
                    this.handleAddMovie(data);
                }}
                icon={
                  <Ionicons name="bookmark-outline" size={28} color="#fff" />
                }
              />
            )}
          </Box>
          <Box flexDirection={"row"} alignItems={"center"}>
            <MaterialIcons name="star-rate" size={12} color="yellow" />
            <Text fontSize={12} color={"trueGray.400"} mr={2}>
              {data.vote_average}
            </Text>

            <Text fontSize={12} color={"trueGray.400"} mr={2}>
              release : {moment(data.release_date).format("LL")}
            </Text>
          </Box>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack mt={2}>
              {details.map((name) => (
                <Box
                  bgColor={"#474E68"}
                  px={"15px"}
                  py={"5px"}
                  rounded="full"
                  ml={"5px"}
                  mt={2}
                  key={name.name}
                >
                  <Text color={"#FFF"}>{name.name}</Text>
                </Box>
              ))}
            </HStack>
          </ScrollView>

          <Box mt={5}>
            {data.overview == "" ? (
              <Center flex={1} h={50} my={5}>
                <Icon
                  as={AntDesign}
                  name="frowno"
                  size={50}
                  color="#FFF"
                  mb={2}
                />
                <Text fontSize={16} bold={true} color="#FFF">
                  No Overview
                </Text>
              </Center>
            ) : (
              <Text fontSize={14} color={"#FFF"} textAlign={"justify"}>
                {data.overview}
              </Text>
            )}
          </Box>
          <Box mt={5}>
            <Text color={"#FFFFFF"} fontSize={20}>
              Cast
            </Text>
            <FlatList
              data={cast}
              keyExtractor={({ id }, index) => id}
              renderItem={this.renderCast}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </Box>
          <Box mt={5}>
            <Text color={"#FFFFFF"} fontSize={20}>
              Recommendations
            </Text>
            {movie == 0 ? (
              <Center flex={1} h={150}>
                <Icon
                  as={AntDesign}
                  name="frowno"
                  size={50}
                  color="#FFF"
                  mb={2}
                />
                <Text fontSize={16} bold={true} color="#FFF">
                  No Recommendations
                </Text>
              </Center>
            ) : (
              <FlatList
                data={movie}
                keyExtractor={({ id }, index) => id}
                renderItem={this.renderMovie}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </Box>
        </Box>
      </ScrollView>
    );
  }
}

export default DetailsMovie;
