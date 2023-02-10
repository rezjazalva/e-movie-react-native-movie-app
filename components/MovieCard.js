import React, { Component } from "react";
import { Image, Text, Box, Pressable, Spacer } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

class MovieCard extends Component {
  render() {
    return (
      <Pressable
        onPress={this.props.onPress}
        _pressed={{ bgColor: "trueGray.500" }}
        w={this.props.width}
        h={this.props.height}
        justifyContent={this.props.justifyContent}
        borderRadius={5}
        bgColor={this.props.bgColor}
        mx={2}
        my={"7px"}
        shadow={2}
      >
        <Image
          source={this.props.source}
          width={"100%"}
          h={"75%"}
          alt="foto"
          borderRadius={5}
          resizeMode={"cover"}
        />
        <Text fontSize={14} numberOfLines={2} mx={1} color={"#FFFF"}>
          {this.props.title}
        </Text>
        <Spacer />
        <Box flexDirection={"row"} alignItems={"center"}>
          {this.props.rateIcon && (
            <MaterialIcons name="star-rate" size={16} color="yellow" />
          )}

          <Text fontSize={12} mx={1} color={"#FFFF"}>
            {this.props.rate}
          </Text>
        </Box>
      </Pressable>
    );
  }
}

export default MovieCard;
