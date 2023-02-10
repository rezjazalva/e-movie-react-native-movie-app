import React, { Component } from "react";
import {
  Center,
  Text,
  Box,
  ScrollView,
  Spinner,
  Icon,
  Pressable,
} from "native-base";
import { Header, ListCard } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AntDesign } from "@expo/vector-icons";

const imgUrl = "https://image.tmdb.org/t/p/w500";

class FavoriteScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allList: [],
      isLoading: true,
    };
  }

  getFavorite = async () => {
    try {
      const value = await AsyncStorage.getItem("@favorite-list");
      if (value !== null) {
        this.setState({ allList: JSON.parse(value) });
      }
    } catch (e) {
      console.log("Error get task: in task-all.js");
      console.error(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.getFavorite();
    this.focusHandler = navigation.addListener("focus", () => {
      this.getFavorite();
    });
  }

  handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      this.setState({ isLoading: true, allList: [] });
      this.getFavorite();
    } catch (e) {
      console.log("Error clear data: in about.js");
      console.error(e);
    }
  };

  handleDeleteMovie = (index) => {
    const deletedList = this.state.allList.filter(
      (allList, listIndex) => listIndex !== index
    );
    this.setState({ allList: deletedList }, () => {
      try {
        AsyncStorage.setItem(
          "@favorite-list",
          JSON.stringify(this.state.allList)
        );
      } catch (e) {
        console.error(e.message);
      }
    });
  };

  render() {
    const { allList, isLoading } = this.state;
    const { navigation } = this.props;
    return (
      <Box flex={1} bgColor={"#282A3A"}>
        <Header title={"Favorite"} />
        <Box mt="2" mx="2" mb="5px">
          <Pressable
            onPress={this.handleClearData}
            w={"20%"}
            _pressed={{ bg: "trueGray.500" }}
            bg={"#474E68"}
            h={"35px"}
            rounded="full"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text color={"#FFF"}>Clear All</Text>
          </Pressable>
        </Box>

        {isLoading ? (
          <Center flex={1} justifyContent={"center"}>
            <Spinner size="large" color="#AA0002" />
          </Center>
        ) : allList == 0 ? (
          <Center flex={1}>
            <Icon as={AntDesign} name="frowno" size={82} color="#FFF" mb={2} />
            <Text fontSize={16} bold={true} color="#FFF">
              No Favorite Movie
            </Text>
          </Center>
        ) : (
          <ScrollView>
            <Box flex={1} mt="10px" mx="5px" mb="5px" bgColor={"#282A3A"}>
              {allList.map((item, index) => {
                return (
                  <Box key={item.id + index.toString()}>
                    <ListCard
                      title={item.title}
                      rate={item.vote_average}
                      color={"#FFFF"}
                      source={
                        item.poster_path
                          ? { uri: `${imgUrl}/${item.poster_path}` }
                          : require("../assets/no_image.png")
                      }
                      onPress={() =>
                        navigation.navigate("DetailsMovie", { data: item })
                      }
                      rateIcon={true}
                      deletedIcon={true}
                      onDeleted={() => this.handleDeleteMovie(index)}
                    />
                  </Box>
                );
              })}
            </Box>
          </ScrollView>
        )}
      </Box>
    );
  }
}

export default FavoriteScreen;
