import { StyleSheet } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { Image } from "expo-image";
import { getUserImageSource } from "../services/ImageService";

const Avatar = ({
  uri,
  size = hp(5),
  rounded = theme.radius.md,
  style = {},
}) => {
  return (
    <Image
      source={getUserImageSource(uri)}
      style={[
        { width: size, height: size, borderRadius: rounded },
        style,
        styles.avatar,
      ]}
      transition={100}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
