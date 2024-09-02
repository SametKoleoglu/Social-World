import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Loading,
  PostCard,
  ProfileHeader,
  ScreenWrapper,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { fetchPosts } from "../../services/PostService";

var limit = 10;
const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  // STATES
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // FUNCTIONS
  const onSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", error.message);
    }
  };

  const handleSignout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Signout",
        onPress: () => onSignout(),
        style: "destructive",
      },
    ]);
  };

  useEffect(() => {
    getPosts();
  },[])
  const getPosts = async () => {
    if (!hasMore) {
      return null;
    }
    limit += 5;
    let response = await fetchPosts(limit, user?.id);

    if (response.success) {
      if (posts.length === response.data.length) {
        setHasMore(false);
      }
      setPosts(response.data);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* HEADER */}
            <ProfileHeader
              user={user}
              router={router}
              showBackButton={true}
              title={"Profile"}
              handleSignout={handleSignout}
            />

            {/* BODY */}
            <View style={styles.container2}>
              <View style={styles.container3}>
                <View style={styles.avatarContainer}>
                  <Avatar
                    uri={user?.image}
                    size={hp(10)}
                    rounded={theme.radius.xxl * 1.5}
                  />
                  <TouchableOpacity
                    onPress={() => router.push("EditProfile")}
                    style={styles.editIcon}
                  >
                    <Icon name={"edit"} strokeWidth={2.5} size={hp(2)} />
                  </TouchableOpacity>
                </View>
                {/* USERNAME AND ADDRESS */}
                <View style={styles.container4}>
                  <Text style={styles.username}>{user && user.name}</Text>
                  <Text style={styles.infoText}>{user && user.address}</Text>
                </View>

                {/* EMAIL,PHONE,BIO */}
                <View style={styles.container5}>
                  <View style={styles.info}>
                    <Icon
                      name={"mail"}
                      size={hp(2.5)}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.infoText}>{user && user.email}</Text>
                  </View>

                  {user && user.phoneNumber && (
                    <View style={styles.info}>
                      <Icon
                        name={"call"}
                        size={hp(2.5)}
                        color={theme.colors.textLight}
                      />
                      <Text style={styles.infoText}>{user.phoneNumber}</Text>
                    </View>
                  )}

                  {user && user.bio && (
                    <View style={styles.info}>
                      <Icon
                        name={"edit"}
                        size={hp(2.5)}
                        color={theme.colors.textLight}
                      />
                      <Text style={styles.infoText}>{user.bio}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        contentContainerStyle={{ paddingTop: wp(3), paddingHorizontal: wp(3) }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        onEndReached={() => {
          getPosts();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 40 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                That's all :{")"}
              </Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp(2.5),
  },
  container2: {},
  container3: {
    gap: 15,
  },
  avatarContainer: {
    height: hp(10),
    width: hp(10),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#fff",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  container4: {
    alignItems: "center",
    gap: 5,
  },
  username: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  infoText: {
    fontSize: hp(1.5),
    fontWeight: "500",
    color: theme.colors.textLight,
    alignSelf: "center",
  },
  container5: {
    marginTop: 15,
    gap: 20,
  },
  info: {
    flexDirection: "row",
    fontWeight: "500",
    color: theme.colors.textLight,
    gap: 10,
  },
});
