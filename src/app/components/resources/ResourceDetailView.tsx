import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";
import { ResourceListItem } from "../../resources/types";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

interface ResourceDetailViewProps {
  resource: ResourceListItem;
  relatedResources: ResourceListItem[];
  onBack?: () => void;
  onSaveForLater?: () => void;
  onWatchNow?: () => void;
  onRelatedResourcePress?: (resourceId: string) => void;
  saveButtonLabel?: string;
}

const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({
  resource,
  relatedResources,
  onBack,
  onSaveForLater,
  onWatchNow,
  onRelatedResourcePress,
  saveButtonLabel,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={ms(22)} color={colors.textPrimary} />
          </TouchableOpacity>
        )}

        <Text style={styles.screenTitle}>{resource.title}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image source={resource.image} style={styles.heroImage} />

        {/* Full Content */}
        {resource.fullContent && (
          <Text style={styles.fullContent}>{resource.fullContent}</Text>
        )}

        {/* Steps */}
        {resource.steps && resource.steps.length > 0 && (
          <View style={styles.stepsContainer}>
            {resource.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{index + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <View style={styles.buttonWrapper}>
            <SecondaryButton
              title={saveButtonLabel || "Save for later"}
              onPress={onSaveForLater || (() => {})}
            />
          </View>

          {resource.videoUrl && onWatchNow && (
            <View style={styles.buttonWrapper}>
              <PrimaryButton
                title="Watch now"
                onPress={onWatchNow}
              />
            </View>
          )}
        </View>

        {/* Related Tips */}
        {relatedResources.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Tips</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {relatedResources.map((relatedResource) => (
                <View key={relatedResource.id} style={styles.relatedCard}>
                  <TouchableOpacity
                    onPress={
                      onRelatedResourcePress
                        ? () => onRelatedResourcePress(relatedResource.id)
                        : undefined
                    }
                    activeOpacity={0.85}
                  >
                    <Image
                      source={relatedResource.image}
                      style={styles.relatedImage}
                    />
                    <Text style={styles.relatedCardTitle} numberOfLines={2}>
                      {relatedResource.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ms(spacing.lg),
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
  scrollContent: {
    paddingBottom: ms(spacing.xl * 1.5),
    gap: ms(spacing.lg),
  },
  heroImage: {
    width: "100%",
    height: ms(240),
    borderRadius: ms(16),
    resizeMode: "cover",
  },
  fullContent: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    lineHeight: rfs(typography.bodyMedium.fontSize) * 1.5,
  },
  stepsContainer: {
    gap: ms(spacing.sm),
  },
  stepRow: {
    flexDirection: "row",
    gap: ms(spacing.xs),
  },
  stepNumber: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  stepText: {
    flex: 1,
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: ms(spacing.md),
  },
  buttonWrapper: {
    flex: 1,
  },
  relatedSection: {
    gap: ms(spacing.md),
  },
  relatedTitle: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
  },
  relatedScroll: {
    gap: ms(spacing.md),
    paddingRight: ms(spacing.lg),
  },
  relatedCard: {
    width: ms(160),
  },
  relatedImage: {
    width: ms(160),
    height: ms(120),
    borderRadius: ms(12),
    resizeMode: "cover",
    marginBottom: ms(spacing.xs),
  },
  relatedCardTitle: {
    fontSize: rfs(typography.labelMedium.fontSize),
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.textPrimary,
  },
});

export default ResourceDetailView;
