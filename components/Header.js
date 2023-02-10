import React from "react";
import { Text, HStack, Pressable, Box } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Header = (props) => {
  const navigation = useNavigation();
  return (
    <Box bgColor={"#282A3A"} py={4} borderBottomWidth={1} mb={2}>
      <HStack alignItems={"center"} w={"70%"}>
        {props.backButton && (
          <Pressable
            onPress={() => navigation.popToTop()}
            mr={"10px"}
            ml={2}
            _pressed={{ bgColor: "trueGray.500" }}
          >
            <Ionicons name="ios-arrow-back-outline" size={25} color={"#FFF"} />
          </Pressable>
        )}
        <Text fontSize={22} fontWeight={"bold"} ml={2} color={"#FFF"}>
          {props.title}
        </Text>
      </HStack>
    </Box>
  );
};

export default Header;
