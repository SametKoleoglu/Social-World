import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { HomeHeader, Loading, PostCard } from "../../components";
import { useRouter } from "expo-router";
import { fetchPosts } from "../../services/PostService";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services/UserService";
import { theme } from "../../constants/theme";

var limit = 0;
const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  // STATES
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // FUNCTIONS

  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 5;
    let response = await fetchPosts(limit);

    if (response.success) {
      if (posts.length === response.data.length) {
        setHasMore(false);
      }
      setPosts(response.data);
    }
  };

  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    if (payload.eventType == "DELETE" && payload.old.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter(
          (post) => post.id != payload.old.id
        );
        return updatedPosts;
      });
    }

    if (payload.eventType == "UPDATE" && payload.old.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.map((post) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      setNotificationCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    let notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg={"white"}>
      {/* HEADER */}
      <HomeHeader
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
        user={user}
      />

      {/* POSTS */}
      <FlatList
        data={posts}
        contentContainerStyle={styles.listStyle}
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
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 40 }}>
              <Text style={styles.noPosts}>That's all :{")"}</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  listStyle: {
    paddingTop: wp(3),
    paddingHorizontal: wp(3),
  },
  noPosts: {
    textAlign: "center",
    color: theme.colors.primary,
    fontSize: hp(2.5),
    marginBottom: hp(1),
  },
});
