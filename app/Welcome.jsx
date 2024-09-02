import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button, ScreenWrapper } from "../components";
import { wp, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image
          source={require("../assets/images/wlcm.jpg")}
          resizeMode="contain"
          style={styles.welcomeImage}
        />

        {/* TITLE */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Social World</Text>
          <Text style={styles.punchline}>
            Where every though finds a home and every image tells a story
          </Text>
        </View>
        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Button
            title="Getting Started"
            onPress={() => {
              router.navigate("SignUp");
            }}
          />

          <View style={styles.bottomTextContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("SignIn");
              }}
            >
              <Text
                style={[
                  styles.signInText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(5),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  titleContainer: {
    gap: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(5),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    color: theme.colors.text,
    fontSize: hp(1.5),
    textAlign: "center",
    paddingHorizontal: wp(10),
  },
  footerContainer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  signInText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.5),
  },
});
