import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/NotificationService";
import { useAuth } from "../../context/AuthContext";
import { NotificationItem, ScreenWrapper } from "../../components";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Header from "../../components/ProfileHeader";
import { useRouter } from "expo-router";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let response = await fetchNotifications(user.id);
    if (response.success) setNotifications(response.data);
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <Header title={"Notifications"} showBackButton router={router} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications &&
            notifications.map((notification, index) => (
              <NotificationItem
                item={notification}
                key={index}
                router={router}
              />
            ))}
          {notifications.length == 0 && (
            <Text style={styles.noData}>No Notifications Yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: theme.colors.text,
    fontSize: hp(2),
  },
});

export default Notifications;
