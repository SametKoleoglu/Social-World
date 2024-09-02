import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  ProfileHeader,
  RichTextEditor,
  ScreenWrapper,
} from "../../components";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../../assets/icons";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "../../services/ImageService";
import { Video } from "expo-av";
import { createOrUpdatePost } from "../../services/PostService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

const NewPost = () => {
  const post = useLocalSearchParams();
  console.log("post -> ", post);

  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();

  // STATES
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post?.body;
      setFile(post?.file || null);
      setTimeout(() => {
        editorRef?.current?.setContentHTML(post?.body);
      }, 300);
    }
  }, []);

  // FUNCTIONS
  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspects: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file === "object") return true;

    return false;
  };
  const getFileType = (file) => {
    if (!file) {
      return null;
    }
    if (isLocalFile(file)) {
      return file.type;
    }

    // check image or video for remote file
    if (file.includes("postImage")) {
      return "image";
    }

    return "video";
  };

  const getFileUri = (file) => {
    if (!file) {
      return null;
    }
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please add text or upload a file");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };

    if (post && post.id) data.id = post.id;

    // Create Post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    if (res.success) {
      setLoading(false);
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      if (post && post.id) {
        Alert.alert("Post", "Post updated successfully");
      }else{
        Alert.alert("Post", "Post created successfully");
      }
      router.back();
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <ProfileHeader
          showBackButton={true}
          title={"New Post"}
          router={router}
        />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag" contentContainerStyle={{ gap: 20 }}>
          {/* Avatar */}

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("Profile")}>
              <Avatar
                uri={user?.image}
                size={hp(7)}
                rounded={theme.radius.xxl}
              />
            </TouchableOpacity>
            <View style={{ gap: 5 }}>
              <Text style={styles.username}>{user && user.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) === "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              )}

              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setFile(null)}
              >
                <Icon name={"delete"} size={hp(3)} color={"#fff"} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name={"image"} size={hp(3)} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name={"video"} size={hp(3)} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Button
          buttonStyle={{ height: hp(6), marginBottom: hp(3) }}
          title={post && post?.id ? "Update" : "Post"}
          loading={loading}
          hasShow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2.5),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  username: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: hp(1.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {},
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(32),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  video: {},
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.5)",
  },
});
