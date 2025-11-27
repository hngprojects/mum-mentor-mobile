// src/screens/NotificationsScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/src/core/styles';
import { ms, vs, rbr } from '@/src/core/styles/scaling';
import { router } from 'expo-router';

// Notification type interface
export interface Notification {
  id: string;
  type: 'milestone' | 'like' | 'comment';
  title: string;
  description: string;
  timestamp: string; // 'today' or 'yesterday'
  isRead: boolean;
}

interface NotificationsScreenProps {
  notifications?: Notification[];
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications = [
    {
    id: '1',
    type: 'milestone',
    title: 'You have completed a milestone',
    description: 'You rested for 30minutes',
    timestamp: 'today',
    isRead: false,
  },
  {
    id: '2',
    type: 'like',
    title: 'New Like',
    description: "2 people liked your post on the 'New Mum' community",
    timestamp: 'today',
    isRead: false,
  },
  {
    id: '3',
    type: 'comment',
    title: 'New Comment',
    description: "You have received a new comment on your post on the 'New Mum' community",
    timestamp: 'today',
    isRead: false,
  },
  {
    id: '4',
    type: 'milestone',
    title: 'You have completed a milestone',
    description: 'You rested for 30minutes',
    timestamp: 'yesterday',
    isRead: true,
  },
  {
    id: '5',
    type: 'like',
    title: 'New Like',
    description: "2 people liked your post on the 'New Mum' community",
    timestamp: 'yesterday',
    isRead: true,
  },
  {
    id: '6',
    type: 'comment',
    title: 'New Comment',
    description: "You have received a new comment on your post on the 'New Mum' community",
    timestamp: 'yesterday',
    isRead: true,
  },
  ],
}) => {
  // Group notifications by timestamp
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const key = notification.timestamp.toLowerCase();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const notificationIcon = require("../../assets/images/notification.png");
  const milestoneIcon = require("../../assets/images/complete-milestone.png");
  const likeIcon = require("../../assets/images/new-like.png");
  const commentIcon = require("../../assets/images/new-comment.png");

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return milestoneIcon;
      case 'like':
        return likeIcon;
      case 'comment':
        return commentIcon;
      default:
        return notificationIcon;
    }
  };

  // Render single notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Image 
          source={getNotificationIcon(item.type)}
          style={styles.notificationImage}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>

      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}> 
        <Image source={notificationIcon} style={styles.notificationIcon} />
      </View>
      <Text style={styles.emptyTitle}>No Notification to show</Text>
      <Text style={styles.emptyDescription}>
        You currently have no notification. We will notify you when something new happens
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Render grouped notifications */}
          {Object.keys(groupedNotifications).map((timeGroup) => (
            <View key={timeGroup} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>
                {timeGroup.charAt(0).toUpperCase() + timeGroup.slice(1)}
              </Text>
              
              <FlatList
                data={groupedNotifications[timeGroup]}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: ms(40),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: ms(20),
  },
  groupContainer: {
    marginBottom: vs(24),
  },
  groupTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(12),
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundMain,
    padding: ms(16),
    borderRadius: rbr(12),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: rbr(12),
    borderWidth: 2,
    borderColor: colors.backgroundSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  notificationImage: {
    width: ms(24),
    height: ms(24),
    resizeMode: "contain",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(4),
  },
  notificationDescription: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    lineHeight: 20,
  },
  unreadDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.primary,
    marginLeft: ms(8),
    marginTop: vs(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(40),
  },
  emptyIconContainer: {
    marginBottom: vs(24),
  },
  notificationIcon: {
    width: ms(28),
    height: ms(28),
    resizeMode: "contain",
    alignSelf: "flex-start",
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: vs(12),
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    lineHeight: 24,
  },
});