import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "./Avatar";

const Header = ({ user, notificationCount, setNotificationCount }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social World</Text>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() => {
            setNotificationCount(0);
            router.push("Notifications");
          }}
        >
          <Icon
            name="heart"
            strokeWidth={2}
            size={hp(3)}
            color={theme.colors.text}
          />
          {notificationCount > 0 && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("NewPost")}>
          <Icon
            name="plus"
            strokeWidth={2}
            size={hp(3)}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("Profile")}>
          <Avatar
            uri={user?.image}
            size={hp(4)}
            rounded={theme.radius.sm}
            style={{ borderWidth: 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(3),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4),
    width: hp(4),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(5),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -5,
    height: hp(2.3),
    width: hp(2.3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1),
    fontWeight: theme.fonts.bold,
  },
});
