import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input, ScreenWrapper, ProfileHeader } from "../../components";
import { hp, wp } from "../../helpers/common";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { getUserImageSource, uploadFile } from "../../services/ImageService";
import { Image } from "expo-image";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { updateUserData } from "../../services/UserService";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  // GET USER INFO
  const { user: currentUser, setUserData } = useAuth();

  // STATES
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSource(user?.image);

  // FUNCTIONS
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspects: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };
  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;

    if (!name && !phoneNumber && !address && !image && !bio) {
      Alert.alert("Error", "Please fill the fields");
      return;
    }
    setLoading(true);

    if (typeof image === "object") {
      let imageResponse = await uploadFile("profiles", image?.uri, true);
      if (imageResponse.success) userData.image = imageResponse.data;
      else userData.image = null;
    }
    const response = await updateUserData(currentUser?.id, userData);

    if (response.success) {
      setLoading(false);
      Alert.alert("Success", "Profile updated successfully");
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ height: hp(120) }}
        >
          <ProfileHeader
            router={router}
            showBackButton={true}
            showSignoutButton={false}
            title="Edit Profile"
          />

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name={"camera"} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={styles.detailText}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name={"user"} />}
              placeholder="Enter Username"
              value={user?.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name={"call"} />}
              placeholder="Enter Phone Number"
              value={user?.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name={"location"} />}
              placeholder="Enter Address"
              value={user?.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              icon={<Icon name={"edit"} />}
              placeholder="Enter Bio"
              value={user?.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <Button onPress={onSubmit} title="Update" loading={loading} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2.5),
  },
  scrollView: {
    flex: 1,
  },
  form: {
    gap: 20,
    marginTop: 20,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: theme.radius.xxl * 1.5,
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: -5,
    right: -10,
    padding: 1,
    borderRadius: 50,
    backgroundColor: "#fff",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  detailText: {
    fontSize: hp(1.5),
    color: theme.colors.text,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 18,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(12),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});

export default EditProfile;
