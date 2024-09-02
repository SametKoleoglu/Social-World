import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

const Input = (props) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    paddingHorizontal: 20,
    gap: 10,
  },
});

export default Input;
