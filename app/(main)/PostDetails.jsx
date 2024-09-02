import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "../../services/PostService";
import { getUserData } from "../../services/UserService";
import { wp, hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { CommentItem, Input, Loading, PostCard } from "../../components";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../assets/icons";
import { supabase } from "../../lib/supabase";
import { createNotification } from "../../services/NotificationService";

const PostDetails = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const inputRef = useRef(null);
  const commentRef = useRef(null);

  // STATES
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  // FUNCTIONS

  const handleNewComment = async (payload) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let response = await getUserData(newComment.userId);
      newComment.user = response.success ? response.data : {};
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetail();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const onNewComment = async () => {
    if (!commentRef.current) return null;

    let data = {
      postId: post?.id,
      userId: user?.id,
      text: commentRef.current,
    };

    setLoading(true);
    let response = await createComment(data);
    setLoading(false);

    if (response.success) {
      // send notification later
      if (user.id != post.userId) {
        // send notification
        let notification = {
          senderId: user.id,
          receiverId: post.userId,
          title: "Commented on u post",
          data: JSON.stringify({
            postId: post.id,
            commentId: response?.data?.id,
          }),
        };
        createNotification(notification);
      }

      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment dont created !", response.msg);
    }
  };

  const onDeleteComment = async (comment) => {
    let response = await removeComment(comment?.id);
    if (response.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id !== comment.id
        );

        return updatedPost;
      });
    } else {
      Alert.alert("Comment dont deleted !", response.msg);
    }
  };

  const onDeletePost = async (post) => {
    let response = await removePost(post?.id);
    if (response.success) {
      Alert.alert("Post deleted successfully !");
      router.back();
    } else {
      Alert.alert("Post dont deleted !", response.msg);
    }
  };

  const onEditPost = async (item) => {
    router.back();
    router.push({ pathname: "NewPost", params: { ...item } });
  };

  const getPostDetail = async () => {
    // fetch post detail
    let response = await fetchPostDetails(postId);
    if (response.success) setPost(response.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { marginTop: 100, justifyContent: "flex-start" },
        ]}
      >
        <Text style={styles.notFound}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post.comments.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={(text) => (commentRef.current = text)}
            placeholder="Write a comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6),
              borderRadius: theme.radius.xl,
            }}
          />

          <TouchableOpacity onPress={onNewComment}>
            <Icon name={"send"} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* COMMENTS */}
        <View style={{ marginVertical: 15, gap: 15 }}>
          {post?.comments?.map((comment, index) => (
            <CommentItem
              key={index}
              item={comment}
              onDelete={onDeleteComment}
              highlight={comment.id == commentId}
              canDelete={
                user?.id == comment?.userId || user?.id == post?.userId
              }
            />
          ))}

          {post?.comments?.length == 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be first to comment !!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: wp(5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.9,
    borderColor: theme.colors.primary,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    height: hp(6),
    width: hp(6),
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(6),
    width: hp(6),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.4 }],
  },
});
