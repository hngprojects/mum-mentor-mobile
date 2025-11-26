import { Feather } from "@expo/vector-icons";
import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../../../../core/styles";
import { ms, rfs } from "../../../../core/styles/scaling";
import { resourceSections } from "../../data";

const playIcon = require("@/src/assets/images/play-video.png");

const LIKE_COUNT = 52;
const COMMENT_COUNT = 20;

const ResourceWatchScreen: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<Video | null>(null);
  const { resourceId } = useLocalSearchParams<{
    resourceId?: string | string[];
  }>();

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(3 / 4);

  const normalizedResourceId = Array.isArray(resourceId)
    ? resourceId[0]
    : resourceId;

  const resource = useMemo(() => {
    if (!normalizedResourceId) {
      return null;
    }

    for (const section of resourceSections) {
      const found = section.resources.find(
        (item) => item.id === normalizedResourceId
      );
      if (found) {
        return found;
      }
    }

    return null;
  }, [normalizedResourceId]);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    setShowVideo(false);
    setIsVideoReady(false);
    setVideoAspectRatio(3 / 4);

    return () => {
      videoRef.current?.stopAsync().catch(() => undefined);
    };
  }, [normalizedResourceId]);

  const handlePlay = async () => {
    if (!resource?.videoUrl) {
      return;
    }

    setIsVideoReady(false);
    setShowVideo(true);

    try {
      await videoRef.current?.playAsync();
    } catch (error) {
      console.error("Failed to start video playback", error);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    const successStatus = status as AVPlaybackStatusSuccess;
    //@ts-ignore
    const { width, height } = successStatus?.naturalSize || {};
    if (width && height) {
      const ratio = width / height;
      if (ratio > 0 && Number.isFinite(ratio)) {
        setVideoAspectRatio(ratio);
      }
    }

    setIsVideoReady(true);
  };

  if (!resource) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.backgroundMain}
        />
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>Resource not found</Text>
          <Text style={styles.errorMessage}>
            The selected resource is unavailable. Please try again later.
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonLabel}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundMain}
      />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather
              name="arrow-left"
              size={ms(22)}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.screenTitle} numberOfLines={1}>
            {resource.title}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View
          style={[styles.videoContainer, { aspectRatio: videoAspectRatio }]}
        >
          {showVideo ? (
            <View style={styles.videoWrapper}>
              {!isVideoReady ? (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="large" color={colors.textWhite} />
                </View>
              ) : null}

              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: resource.videoUrl! }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                posterSource={resource.image}
                posterStyle={styles.posterImage}
              />
            </View>
          ) : (
            <ImageBackground
              source={resource.image}
              style={styles.poster}
              imageStyle={styles.posterImage}
            >
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlay}
                accessibilityRole="button"
                accessibilityLabel="Play video"
              >
                <Image source={playIcon} style={styles.playIcon} />
              </TouchableOpacity>
            </ImageBackground>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather
              name="thumbs-up"
              size={ms(18)}
              color={colors.textPrimary}
            />
            <Text style={styles.metaLabel}>{LIKE_COUNT} Likes</Text>
          </View>

          <View style={styles.metaItem}>
            <Feather
              name="message-circle"
              size={ms(18)}
              color={colors.textPrimary}
            />
            <Text style={styles.metaLabel}>{COMMENT_COUNT} Comments</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
    gap: ms(spacing.lg),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    flex: 1,
    textAlign: "left",
    marginHorizontal: ms(spacing.sm),
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: ms(40),
  },
  videoContainer: {
    borderRadius: ms(16),
    overflow: "hidden",
    backgroundColor: colors.backgroundMuted,
    alignSelf: "stretch",
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  poster: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  playIcon: {
    width: ms(90),
    height: ms(90),
    resizeMode: "contain",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.md),
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(spacing.xs),
  },
  metaLabel: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
  },
  errorContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: ms(spacing.md),
    paddingHorizontal: ms(spacing.lg),
  },
  errorTitle: {
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
  },
  errorMessage: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: colors.primary,
    borderRadius: ms(12),
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.sm),
  },
  errorButtonLabel: {
    fontSize: rfs(typography.buttonText.fontSize),
    fontFamily: typography.buttonText.fontFamily,
    color: colors.textWhite,
  },
});

export default ResourceWatchScreen;
