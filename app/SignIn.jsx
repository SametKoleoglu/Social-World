import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { BackButton, Button, Input, ScreenWrapper } from "../components";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { supabase } from "../lib/supabase";

const SignIn = () => {
  const router = useRouter("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false);
    console.log("error", error);

    if(error){
      Alert.alert("Sign In", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />

        {/* WELCOME */}
        <View>
          <Text style={styles.welcomeText}>Hey!</Text>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please Sign In to Continue
          </Text>

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

          <Text style={styles.forgotPassword}>Forgot Password ?</Text>

          {/* BUTTON */}
          <Button title="Sign In" loading={loading} onPress={onSubmit} />
        </View>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => router.navigate("SignUp")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignIn;

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
