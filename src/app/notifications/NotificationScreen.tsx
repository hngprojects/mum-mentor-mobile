//You can see how you can use the notification in a real app, in state and using an API for future reference by me or any team member

import React from 'react';
import NotificationsScreen, { Notification } from '.';

// Sample notifications data
export const sampleNotifications: Notification[] = [
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
];

// Usage Example 1: With notifications
export const NotificationsScreenWithData = () => {
  return <NotificationsScreen notifications={sampleNotifications} />;
};

// Usage Example 2: Empty state (no notifications)
export const NotificationsScreenEmpty = () => {
  return <NotificationsScreen notifications={[]} />;
};

// Usage Example 3: In a real app with state management
export const NotificationsScreenWithState = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(sampleNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return <NotificationsScreen notifications={notifications} />;
};

// Usage Example 4: Fetching from API
export const NotificationsScreenWithAPI = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return null; // or a loading component
  }

  return <NotificationsScreen notifications={notifications} />;
};