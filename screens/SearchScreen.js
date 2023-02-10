import React, { Component } from "react";
import {
  Center,
  Text,
  Box,
  Input,
  Icon,
  FlatList,
  HStack,
  Spinner,
  Pressable,
  IconButton,
} from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListCard } from "../components";
import { AntDesign } from "@expo/vector-icons";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "your api key";
const imgUrl = "https://image.tmdb.org/t/p/w500";

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      movie: [],
      pages: 1,
      isFetching: false,
      iconChange: false,
      totalPages: "",
      isLoad: false,
    };
  }

  getMovie = () => {
    const { title, pages } = this.state;
    fetch(
      `${baseUrl}/search/movie?api_key=${apiKey}&query=${title}&page=${pages}`
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
          isFetching: false,
          isLoad: false,
        })
      );
  };

  handleLoadMore = () => {
    const { isLoad } = this.state;
    return (
      <IconButton
        onPress={() => {
          this.setState({ pages: this.state.pages + 1 }, this.getMovie),
            this.setState({ isLoad: true });
        }}
        icon={
          isLoad ? (
            <Spinner size="large" color="#AA0002" />
          ) : (
            <Ionicons name="add-circle-outline" size={40} color="#fff" />
          )
        }
      />
    );
  };

  onRefresh = () => {
    this.setState({ isFetching: true, movie: [], pages: 1 }, () => {
      this.getMovie();
    });
  };

  renderList = ({ item }) => {
    const { navigation } = this.props;
    return (
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
    );
  };

  getInput = () => {
    const { title } = this.state;
    this.getMovie(title);
    this.setState({
      isFetching: true,
      movie: [],
      iconChange: true,
    });
  };

  headerSearch = () => {
    const { navigation } = this.props;
    const { title, iconChange } = this.state;
    return (
      <HStack alignItems={"center"} mt={3} ml={2}>
        <Pressable onPress={() => navigation.pop()} mr={"15px"}>
          <Ionicons color={"#FFF"} name="ios-arrow-back-outline" size={25} />
        </Pressable>
        <Input
          onChangeText={(char) => {
            this.setState({ title: char });
          }}
          onSubmitEditing={this.getInput}
          placeholder="Search"
          value={title}
          color={"#FFFFFF"}
          fontSize={16}
          variant="filled"
          width="60%"
          height={"35px"}
          borderRadius="10"
          bgColor={"gray.700"}
          colorScheme={"gray.700"}
          _focus={{ selectionColor: "#FFF" }}
          py="1"
          px="2"
          mb={1}
          InputRightElement={
            iconChange ? (
              <IconButton
                onPress={() => this.setState({ title: "", iconChange: false })}
                icon={
                  <Icon
                    size="4"
                    color={"#FFF"}
                    as={<Ionicons name="md-close-sharp" />}
                  />
                }
              />
            ) : (
              <IconButton
                disabled
                icon={
                  <Icon
                    size="4"
                    color={"#FFF"}
                    as={<Ionicons name="search" />}
                  />
                }
              />
            )
          }
        />
      </HStack>
    );
  };

  render() {
    const { pages, movie, isFetching, totalPages, title } = this.state;
    return (
      <Box flex={1} bgColor={"#282A3A"} justifyContent={"center"}>
        {this.headerSearch()}
        <Box flex={1} bgColor={"#282A3A"} my={"5"} mx={"5px"}>
          {isFetching ? (
            <Center flex={1}>
              <Spinner size="large" color="#AA0002" />
            </Center>
          ) : movie == 0 ? (
            <Center flex={1}>
              <Icon
                as={AntDesign}
                name="frowno"
                size={82}
                color="#FFF"
                mb={2}
              />
              <Text fontSize={16} bold={true} color="#FFF">
                Movie Not Found
              </Text>
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

export default SearchScreen;
