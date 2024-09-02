import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

const BackButton = ({ size = 25, router }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.back()}>
      <Icon
        name="arrowLeft"
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: "baseline",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
