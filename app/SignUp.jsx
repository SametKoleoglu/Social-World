import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { BackButton, Button, Input, ScreenWrapper } from "../components";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { supabase } from "../lib/supabase";

const SignUp = () => {
  const router = useRouter();
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!usernameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Please enter all fields");
      return;
    }

    let username = usernameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
        },
      },
    });

    setLoading(false);

    console.log("session", session);
    console.log("error", error);
    if (error) {
      Alert.alert("Sign Up", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />

        {/* WELCOME */}
        <View>
          <Text style={styles.welcomeText}>Let's!</Text>
          <Text style={styles.welcomeText}>Get Started!</Text>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please Fill the Details to Create an Account
          </Text>

          <Input
            icon={<Icon name={"user"} size={25} strokeWidth={1.5} />}
            placeholder="Username"
            onChangeText={(value) => (usernameRef.current = value)}
          />

          <Input
            icon={<Icon name={"mail"} size={25} strokeWidth={1.5} />}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={<Icon name={"lock"} size={25} strokeWidth={1.5} />}
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />

          {/* BUTTON */}
          <Button title="Sign Up" loading={loading} onPress={onSubmit} />
        </View>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Do you have an account?</Text>

          <TouchableOpacity onPress={() => router.push("SignIn")}>
            <Text
              style={[
                styles.footerText,
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
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: wp(3),
  },
  form: {
    gap: 25,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(5),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.5),
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
  welcomeText: {
    color: theme.colors.text,
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
  },
  formContainer: {
    gap: 30,
  },
});
