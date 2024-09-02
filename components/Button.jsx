import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Loading from "./Loading";

export default Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShow = true,
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  };

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <Loading size="small" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  text: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.bold,
    color: "white",
  },
});
