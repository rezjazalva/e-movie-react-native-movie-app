import React, { Component } from "react";
import { Text, Pressable, HStack } from "native-base";
import { AntDesign } from "@expo/vector-icons";

class Label extends Component {
  render() {
    return (
      <HStack
        mt={1}
        mx={2}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text color={"#FFFFFF"} fontSize={this.props.size}>
          {this.props.title}
        </Text>
        <Pressable
          p={"10px"}
          borderRadius={10}
          alignItems={"center"}
          _pressed={{
            bg: "trueGray.800",
          }}
          onPress={this.props.onPress}
        >
          <AntDesign name="arrowright" size={18} color="#FFFFFF" />
        </Pressable>
      </HStack>
    );
  }
}

export default Label;
