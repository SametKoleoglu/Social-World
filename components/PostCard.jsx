import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../constants/theme";
import { hp, wp, stripHtmlTags } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHTML from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "../services/ImageService";
import { Video } from "expo-av";
import { Image } from "expo-image";
import { blurhash } from "../constants";
import { createPostLike, removePostLike } from "../services/PostService";
import Loading from "./Loading";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  // STATES
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const openPostDetails = () => {
    if (!showMoreIcon) {
      return null;
    }
    router.push({ pathname: "PostDetails", params: { postId: item?.id } });
  };

  // FUNCTIONS
  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter(
        (like) => like?.userId !== currentUser?.id
      );
      setLikes([...updatedLikes]);
      let response = await removePostLike(item?.id, currentUser?.id);
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };

      setLikes([...likes, data]);
      let response = await createPostLike(data);
      console.log("response -> ", response);

      if (!response.success) {
        Alert.alert(
          "Post Like Error",
          "Something went wrong while liking post"
        );
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      // dowload the file then share the local uri
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  
  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this comment?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  }

  const createdAt = moment(item?.created_at).format("MMM D");
  const liked =
    likes != undefined &&
    likes.filter((like) => like.userId === currentUser?.id)[0]
      ? true
      : false;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.5)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon
                name={"edit"}
                size={hp(2.5)}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon
                name={"delete"}
                size={hp(2.5)}
                color={theme.colors.rose}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* POST BODY */}

      {!item ? (
        <ActivityIndicator
          size={"large"}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          color={theme.colors.primary}
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.postBody}>
            {item?.body && (
              <RenderHTML
                contentWidth={wp(100)}
                source={{ html: item?.body }}
                tagsStyles={tagsStyles}
              />
            )}
          </View>

          {/* POST IMAGE */}
          {item?.file && item?.file?.includes("postImages") && (
            <Image
              source={getSupabaseFileUrl(item?.file)}
              style={styles.postMedia}
              contentFit="cover"
              transition={500}
              placeholder={{ blurhash: blurhash }}
            />
          )}

          {/* POST VIDEO */}

          {item?.file && item?.file?.includes("postVideos") && (
            <Video
              style={[styles.postMedia, { height: hp(30) }]}
              source={getSupabaseFileUrl(item?.file)}
              useNativeControls
              resizeMode="cover"
              isLooping
            />
          )}
        </View>
      )}

      {/* LIKE COMMENT SHARE */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name={"heart"}
              size={hp(3)}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name={"comment"}
              size={hp(3)}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments[0]?.count}</Text>
        </View>

        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon
                name={"share"}
                size={hp(3)}
                color={theme.colors.textLight}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.count}>{0}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    gap: 10,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: theme.colors.black,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
