import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";

const NotificationItem = ({ item, router }) => {
  const createdAt = moment(item?.created_at).format("MMM d");
  const handleClick = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "PostDetails", params: { postId, commentId } });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Avatar uri={item?.sender?.image} size={hp(5)} />

      <View style={styles.title}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>

      <Text style={[styles.text, { color: theme.colors.textLight }]}>
        {createdAt}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    borderWidth: 0.5,
    borderColor: "transparent",
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  title: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});

export default NotificationItem;
