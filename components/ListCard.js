import React, { Component } from "react";
import {
  Image,
  Text,
  Pressable,
  HStack,
  Box,
  Spacer,
  IconButton,
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

class ListCard extends Component {
  render() {
    return (
      <Pressable
        bgColor={"#474E68"}
        _pressed={{
          bg: "#6B728E",
        }}
        borderRadius={10}
        onPress={this.props.onPress}
        my={1}
        mx={1}
        overflow={"hidden"}
      >
        <Box my="1px" w={"100%"}>
          <HStack>
            <Image
              h={140}
              w={100}
              source={this.props.source}
              alt="foto"
              borderRadius={10}
            />
            <Box mx="10px" w={"50%"}>
              <Text
                fontSize={15}
                flexShrink={1}
                textAlign="left"
                color={"#FFFF"}
              >
                {this.props.title}
              </Text>
              <Spacer />
              <Box flexDirection={"row"} alignItems={"center"}>
                {this.props.rateIcon && (
                  <MaterialIcons name="star-rate" size={14} color="yellow" />
                )}

                <Text fontSize={14} mx={1} color={this.props.color}>
                  {this.props.rate}
                </Text>
              </Box>
            </Box>
            {this.props.deletedIcon && (
              <IconButton
                mx={5}
                size="sm"
                colorScheme="trueGray"
                icon={
                  <Icon
                    as={FontAwesome5}
                    name="trash"
                    size="sm"
                    color={"#FFF"}
                  />
                }
                onPress={this.props.onDeleted}
              />
            )}
          </HStack>
        </Box>
      </Pressable>
    );
  }
}

export default ListCard;
