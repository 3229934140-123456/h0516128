import { create } from 'zustand';
import type { Notification, NotificationType, NotificationTargetType } from '@/types';
import { mockNotifications } from '@/mock/notifications';
import { getStorage, setStorage } from '@/utils/storage';
import { generateId } from '@/utils/format';

interface NotificationState {
  notifications: Notification[];
  
  getNotifications: () => Notification[];
  getNotificationById: (id: string) => Notification | undefined;
  
  createNotification: (data: {
    title: string;
    content: string;
    type: NotificationType;
    targetType: NotificationTargetType;
    targetRegions?: string[];
    targetUserIds?: string[];
    publisherId: string;
    publisherName: string;
  }) => Notification;
  
  markAsRead: (id: string, userId: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (userId: string, userRole?: string, userRegion?: string) => number;
  getNotificationsForUser: (userId: string, userRole?: string, userRegion?: string) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: getStorage<Notification[]>('notifications', mockNotifications),

  getNotifications: () => get().notifications,

  getNotificationById: (id) => get().notifications.find(n => n.id === id),

  createNotification: (data) => {
    const now = new Date().toISOString();
    const newNotif: Notification = {
      id: generateId('notif-'),
      title: data.title,
      content: data.content,
      type: data.type,
      targetType: data.targetType,
      targetRegions: data.targetRegions,
      targetUserIds: data.targetUserIds,
      publisherId: data.publisherId,
      publisherName: data.publisherName,
      publishAt: now,
      readCount: 0,
      totalCount: 12,
      readBy: []
    };
    
    const updated = [...get().notifications, newNotif];
    set({ notifications: updated });
    setStorage('notifications', updated);
    return newNotif;
  },

  markAsRead: (id, userId) => {
    const updated = get().notifications.map(n => {
      if (n.id === id && !n.readBy?.includes(userId)) {
        return {
          ...n,
          readCount: n.readCount + 1,
          readBy: [...(n.readBy || []), userId]
        };
      }
      return n;
    });
    set({ notifications: updated });
    setStorage('notifications', updated);
  },

  getUnreadCount: (userId, userRole, userRegion) => {
    return get().getNotificationsForUser(userId, userRole, userRegion)
      .filter(n => !n.readBy?.includes(userId)).length;
  },

  getNotificationsForUser: (userId, userRole, userRegion) => {
    return get().notifications.filter(n => {
      if (n.targetType === 'all') return true;
      if (n.targetType === 'region' && userRegion && n.targetRegions?.includes(userRegion)) return true;
      if (n.targetType === 'specified' && n.targetUserIds?.includes(userId)) return true;
      return false;
    }).sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
  },

  markAllAsRead: (userId) => {
    const updated = get().notifications.map(n => {
      if (!n.readBy?.includes(userId)) {
        return {
          ...n,
          readCount: n.readCount + 1,
          readBy: [...(n.readBy || []), userId]
        };
      }
      return n;
    });
    set({ notifications: updated });
    setStorage('notifications', updated);
  },

  deleteNotification: (id) => {
    const updated = get().notifications.filter(n => n.id !== id);
    set({ notifications: updated });
    setStorage('notifications', updated);
  }
}));
