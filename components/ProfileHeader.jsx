import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BackButton from "./BackButton";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";

const ProfileHeader = ({
  user,
  router,
  title,
  showBackButton,
  handleSignout,
  showSignoutButton,
}) => {
  return (
    <>
      <View>
        <View style={styles.container}>
          {showBackButton && (
            <View style={styles.backButton}>
              <BackButton router={router} />
            </View>
          )}
          <Text style={styles.title}>{title || ""}</Text>
        </View>
        {showSignoutButton && (
          <TouchableOpacity
            style={styles.signoutButton}
            onPress={handleSignout}
          >
            <Icon name={"logout"} size={hp(3)} color={theme.colors.rose} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    gap: 10,
    marginBottom: hp(3),
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },

  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  signoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
});
