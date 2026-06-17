import React, { useState } from 'react';
import { Search, Bell, AlertTriangle, FileText, BookOpen, Settings, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDateTime } from '@/utils/date';
import type { NotificationType } from '@/types';

const typeFilters: { value: NotificationType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: '全部', icon: Bell },
  { value: 'system', label: '系统通知', icon: Settings },
  { value: 'policy', label: '政策通知', icon: FileText },
  { value: 'training', label: '培训通知', icon: BookOpen },
  { value: 'urgent', label: '紧急通知', icon: AlertTriangle },
];

export const StoreNotifications: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  const myNotifications = currentUser 
    ? useNotificationStore.getState().getNotificationsForUser(currentUser.id, currentUser.role)
    : [];

  const filteredNotifications = myNotifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const isRead = n.readBy?.includes(currentUser?.id || '');
    const matchesRead = readFilter === 'all' || 
                        (readFilter === 'unread' && !isRead) ||
                        (readFilter === 'read' && isRead);
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = myNotifications.filter(n => !n.readBy?.includes(currentUser?.id || '')).length;

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'policy': return 'bg-purple-100 text-purple-600';
      case 'training': return 'bg-green-100 text-green-600';
      case 'system': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'policy': return FileText;
      case 'training': return BookOpen;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const handleMarkAsRead = (id: string) => {
    if (currentUser) {
      markAsRead(id, currentUser.id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (currentUser) {
      markAllAsRead(currentUser.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            通知中心
          </h1>
          <p className="text-gray-500 mt-1">查看总部发布的各类通知和公告</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            全部标为已读
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {typeFilters.map(filter => {
          const Icon = filter.icon;
          const count = filter.value === 'all' 
            ? myNotifications.length 
            : myNotifications.filter(n => n.type === filter.value).length;
          return (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                typeFilter === filter.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${
                  typeFilter === filter.value ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <span className={`text-xl font-bold ${
                  typeFilter === filter.value ? 'text-orange-600' : 'text-gray-800'
                }`}>
                  {count}
                </span>
              </div>
              <p className={`text-sm ${
                typeFilter === filter.value ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {filter.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索通知标题或内容..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setReadFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  readFilter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setReadFilter('unread')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  readFilter === 'unread'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                未读 ({unreadCount})
              </button>
              <button
                onClick={() => setReadFilter('read')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  readFilter === 'read'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                已读
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">暂无通知</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const TypeIcon = getTypeIcon(notification.type);
              const isRead = notification.readBy?.includes(currentUser?.id || '');
              
              return (
                <div 
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-6 hover:bg-orange-50/50 transition-colors cursor-pointer ${
                    !isRead ? 'bg-orange-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type === 'urgent' ? '紧急' :
                           notification.type === 'policy' ? '政策' :
                           notification.type === 'training' ? '培训' : '系统'}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                      </div>
                      <h3 className={`font-semibold ${
                        !isRead ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-500 mt-2 line-clamp-2">{notification.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatDateTime(notification.publishAt)}
                        </div>
                        <span className="text-sm text-gray-400">
                          发布者：{notification.publisherName}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-2" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            共 <span className="font-semibold text-gray-800">{filteredNotifications.length}</span> 条通知
          </p>
        </div>
      </div>
    </div>
  );
};
