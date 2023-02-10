import React, { Component } from "react";
import { Box, Spinner, FlatList, ScrollView } from "native-base";
import { MovieCard, Label } from "../components";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "your api key";
const imgUrl = "https://image.tmdb.org/t/p/w500";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popular: [],
      nowPlaying: [],
      upcoming: [],
      topRated: [],
      isLoading: true,
    };
  }

  getPopular = () => {
    fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&region=ID`)
      .then((response) => response.json())
      .then((json) => this.setState({ popular: json.results }))
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  getNowPlaying = () => {
    fetch(`${baseUrl}/movie/now_playing?api_key=${apiKey}&region=ID`)
      .then((response) => response.json())
      .then((json) => this.setState({ nowPlaying: json.results }))
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  getUpcoming = () => {
    fetch(`${baseUrl}/movie/upcoming?api_key=${apiKey}&region=ID`)
      .then((response) => response.json())
      .then((json) => this.setState({ upcoming: json.results }))
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  getTopRated = () => {
    fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}&region=ID`)
      .then((response) => response.json())
      .then((json) => this.setState({ topRated: json.results }))
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  componentDidMount() {
    this.getPopular();
    this.getNowPlaying();
    this.getUpcoming();
    this.getTopRated();
  }

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <MovieCard
        source={
          item.poster_path
            ? { uri: `${imgUrl}/${item.backdrop_path}` }
            : require("../assets/no_image.png")
        }
        width={"400"}
        height={250}
        onPress={() => navigation.navigate("DetailsMovie", { data: item })}
        title={item.title}
      />
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
        rateIcon={true}
        onPress={() => navigation.navigate("DetailsMovie", { data: item })}
        bgColor={"#150050"}
      />
    );
  };

  render() {
    const { popular, isLoading, nowPlaying, upcoming, topRated } = this.state;
    const { navigation } = this.props;
    return (
      <Box flex={1} bgColor={"#282A3A"}>
        <ScrollView>
          <Box>
            <Label
              title="Popular"
              size={28}
              onPress={() =>
                navigation.navigate("MovieScreen", { content: "popular" })
              }
            />
            {isLoading ? (
              <Box flex={1} justifyContent={"center"}>
                <Spinner size="large" color="#AA0002" />
              </Box>
            ) : (
              <MovieList data={popular} renderItem={this.renderItem} />
            )}
          </Box>
          <Box mt={5}>
            <Label
              title="Now Playing"
              size={16}
              onPress={() =>
                navigation.navigate("MovieScreen", { content: "now_playing" })
              }
            />
            {isLoading ? (
              <Box flex={1} justifyContent={"center"}>
                <Spinner size="large" color="#AA0002" />
              </Box>
            ) : (
              <MovieList data={nowPlaying} renderItem={this.renderMovie} />
            )}
          </Box>
          <Box mt={5} mb={5}>
            <Label
              size={16}
              title="Upcoming"
              onPress={() =>
                navigation.navigate("MovieScreen", { content: "upcoming" })
              }
            />
            {isLoading ? (
              <Box flex={1} justifyContent={"center"}>
                <Spinner size="large" color="#AA0002" />
              </Box>
            ) : (
              <MovieList data={upcoming} renderItem={this.renderMovie} />
            )}
          </Box>
          <Box>
            <Label
              title="Top Rated"
              size={16}
              onPress={() =>
                navigation.navigate("MovieScreen", { content: "top_rated" })
              }
            />
            {isLoading ? (
              <Box flex={1} justifyContent={"center"}>
                <Spinner size="large" color="#AA0002" />
              </Box>
            ) : (
              <MovieList data={topRated} renderItem={this.renderMovie} />
            )}
          </Box>
        </ScrollView>
      </Box>
    );
  }
}

const MovieList = (props) => {
  return (
    <FlatList
      data={props.data}
      keyExtractor={({ id }) => id}
      renderItem={props.renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default HomeScreen;
