import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Loading, ScreenWrapper } from "../components";

const index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
