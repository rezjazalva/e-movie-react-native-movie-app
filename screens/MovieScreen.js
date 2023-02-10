import React, { Component } from "react";
import {
  Box,
  Spinner,
  FlatList,
  Select,
  CheckIcon,
  HStack,
  Icon,
  IconButton,
} from "native-base";
import { MovieCard, ListCard } from "../components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatGrid } from "react-native-super-grid";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "your api key";
const imgUrl = "https://image.tmdb.org/t/p/w500";

class MovieScreen extends Component {
  constructor(props) {
    super(props);
    const { content } = this.props.route.params;
    this.state = {
      movie: [],
      genre: [],
      isLoading: true,
      pages: 1,
      isLoad: false,
      service: `${content}`,
      iconChange: false,
      totalPages: "",
      isLoad: false,
    };
  }

  getMovie = () => {
    const { pages, service } = this.state;
    fetch(
      `${baseUrl}/movie/${service}?api_key=${apiKey}&region=ID&page=${pages}`
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          movie: this.state.movie.concat(json.results),
          totalPages: json.total_pages,
        })
      )
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false, isLoad: false }));
  };

  componentDidMount() {
    this.getMovie();
  }

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <MovieCard
        title={item.title}
        rate={item.vote_average}
        height={300}
        source={
          item.poster_path
            ? { uri: `${imgUrl}/${item.poster_path}` }
            : require("../assets/no_image.png")
        }
        onPress={() => navigation.navigate("DetailsMovie", { data: item })}
        bgColor={"#150050"}
        rateIcon={true}
      />
    );
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

  filterContent = () => {
    const { service, iconChange } = this.state;
    const { navigation } = this.props;
    return (
      <Box mt="2" mx="2" mb="5px">
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <Box flexDirection={"row"} alignItems={"center"}>
            <IconButton
              onPress={() => navigation.pop()}
              icon={<Ionicons name="arrow-back" size={24} color="#fff" />}
              mr={"10px"}
            />
            <Select
              selectedValue={service}
              minWidth="200"
              color={"#FFFF"}
              h={8}
              accessibilityLabel="Choose Service"
              placeholder="Choose Service"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              borderWidth={2}
              onValueChange={(itemValue) => {
                this.setState(
                  { service: itemValue, movie: [], pages: 1, isLoading: true },
                  this.getMovie
                );
              }}
            >
              <Select.Item label="Popular" value="popular" />
              <Select.Item label="Upcoming" value="upcoming" />
              <Select.Item label="Now Playing" value="now_playing" />
              <Select.Item label="Top Rated" value="top_rated" />
            </Select>
          </Box>
          <IconButton
            onPress={() => {
              this.setState(
                {
                  iconChange: !iconChange,
                  isLoading: true,
                  movie: [],
                  pages: 1,
                },
                this.getMovie
              );
            }}
            icon={
              iconChange ? (
                <Icon color={"#FFF"} size="5" as={<Ionicons name="list" />} />
              ) : (
                <Icon size="5" color={"#FFF"} as={<Ionicons name="grid" />} />
              )
            }
          />
        </HStack>
      </Box>
    );
  };

  onRefresh = () => {
    this.setState({ isLoading: true, movie: [], pages: 1 }, () => {
      this.getMovie();
    });
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

  render() {
    const { movie, isLoading, iconChange, pages, totalPages } = this.state;
    return (
      <Box flex={1} bgColor={"#282A3A"}>
        {this.filterContent()}
        <Box flex={1} mt="1" mx="1" mb="5px">
          {isLoading ? (
            <Box flex={1} justifyContent={"center"}>
              <Spinner size="large" color="#AA0002" />
            </Box>
          ) : iconChange ? (
            <Box>
              <FlatList
                data={movie}
                keyExtractor={({ id }, index) => id}
                renderItem={this.renderList}
                ListFooterComponent={
                  totalPages != pages ? this.handleLoadMore : null
                }
                showsVerticalScrollIndicator={false}
                onRefresh={this.onRefresh}
                refreshing={isLoading}
              />
            </Box>
          ) : (
            <Box>
              <FlatGrid
                data={movie}
                itemDimension={145}
                keyExtractor={({ id }, index) => id}
                renderItem={this.renderItem}
                onRefresh={this.onRefresh}
                refreshing={isLoading}
                ListFooterComponent={
                  totalPages != pages ? this.handleLoadMore : null
                }
                showsVerticalScrollIndicator={false}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default MovieScreen;
