import React, { Component } from "react";
import {
  Center,
  Text,
  Box,
  Icon,
  FlatList,
  ScrollView,
  HStack,
  Spinner,
  Pressable,
  IconButton,
} from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListCard, Header } from "../components";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "your api key";
const imgUrl = "https://image.tmdb.org/t/p/w500";

class ExploreScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: [],
      genres: [],
      pages: 1,
      activeGenres: null,
      isCategoriesLoading: false,
      isContentLoading: true,
      isFetching: false,
      iconChange: false,
      totalPages: "",
    };
  }

  getByGenre = (key) => {
    const { pages } = this.state;
    fetch(
      `${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&page=${pages}&with_genres=${key}`
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          movie: this.state.movie.concat(json.results),
          totalPages: json.total_pages,
        })
      )
      .catch((error) => console.error(error))
      .finally(() =>
        this.setState({
          isContentLoading: false,
          isFetching: false,
          isLoad: false,
        })
      );
  };

  getGenre = () => {
    fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          genres: json.genres,
        })
      )
      .then(() => this.getByGenre(this.state.activeGenres))
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isCategoriesLoading: false }));
  };

  componentDidMount() {
    this.getGenre();
  }

  handleLoadMore = () => {
    const { isLoad } = this.state;
    return (
      <IconButton
        onPress={() => {
          this.setState({ pages: this.state.pages + 1 }, this.getGenre),
            this.setState({ isLoad: true });
        }}
        icon={
          isLoad ? (
            <Spinner color="warning.500" size={"large"} />
          ) : (
            <Ionicons name="add-circle-outline" size={40} color="#fff" />
          )
        }
      />
    );
  };

  onRefresh = () => {
    this.setState({ isFetching: true, movie: [], pages: 1 }, () => {
      this.getGenre();
    });
  };

  categoryOnPress = (id) => {
    this.setState(
      { activeGenres: id, isContentLoading: true, movie: [], pages: 1 },
      this.onRefresh
    );
  };

  renderList = ({ item }) => {
    const { navigation } = this.props;
    return (
      <Box>
        <ListCard
          title={item.title}
          rate={item.vote_average}
          color={"#FFFF"}
          source={
            item.poster_path
              ? { uri: `${imgUrl}/${item.poster_path}` }
              : require("../assets/no_image.png")
          }
          onPress={() => navigation.navigate("DetailsMovie", { data: item })}
          rateIcon={true}
        />
      </Box>
    );
  };

  render() {
    const { navigation } = this.props;
    const {
      movie,
      isContentLoading,
      isCategoriesLoading,
      isFetching,
      pages,
      genres,
      activeGenres,
      totalPages,
    } = this.state;

    return (
      <Box flex={1} bgColor={"#282A3A"}>
        <Header title={"Explore"} />
        <Box flex={1} bgColor={"#282A3A"} mx={"5px"}>
          <Box>
            {!isCategoriesLoading && (
              <Box
                bgColor={"#282A3A"}
                flexDirection={"row"}
                alignItems={"center"}
              >
                <IconButton
                  bgColor={"#474E68"}
                  px={"12px"}
                  py={"6px"}
                  rounded="full"
                  ml={"5px"}
                  mr={"5px"}
                  onPress={() => navigation.navigate("SearchScreen")}
                  icon={
                    <Icon
                      size="6"
                      color={"#FFF"}
                      as={<Ionicons name="search" />}
                    />
                  }
                />
                <ScrollView
                  alignSelf="flex-start"
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  my={"20px"}
                >
                  <HStack>
                    {genres.map((category, index) => (
                      <Pressable
                        key={index}
                        onPress={() => this.categoryOnPress(category.id)}
                      >
                        <Box
                          bg={
                            category.id == activeGenres ? "#282A5A" : "#474E68"
                          }
                          px={"15px"}
                          py={"8px"}
                          rounded="full"
                          ml={"5px"}
                          mr={"5px"}
                        >
                          <Text
                            fontWeight={"bold"}
                            fontSize={12}
                            color={
                              category.id == activeGenres
                                ? "#FFFFFF"
                                : "#FFFFFF"
                            }
                          >
                            {category.name}
                          </Text>
                        </Box>
                      </Pressable>
                    ))}
                  </HStack>
                </ScrollView>
              </Box>
            )}
          </Box>
          {isContentLoading ? (
            <Center flex={1}>
              <Spinner size="large" color="#AA0002" />
            </Center>
          ) : (
            <FlatList
              data={movie}
              keyExtractor={({ id }, index) => id}
              renderItem={this.renderList}
              onRefresh={this.onRefresh}
              refreshing={isFetching}
              ListFooterComponent={
                totalPages != pages ? this.handleLoadMore : null
              }
            />
          )}
        </Box>
      </Box>
    );
  }
}

export default ExploreScreen;
