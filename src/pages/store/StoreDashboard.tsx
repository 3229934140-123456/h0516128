import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Bell, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Store,
  Award,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAgreementStore } from '@/store/useAgreementStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useResourceStore } from '@/store/useResourceStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { formatDate, formatRelativeTime } from '@/utils/date';
import { STAGE_LABELS } from '@/types';

export const StoreDashboard: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const agreements = useAgreementStore(state => state.agreements);
  const notifications = useNotificationStore(state => 
    currentUser ? state.getNotificationsForUser(currentUser.id, currentUser.role, currentUser.province) : []
  );
  const unreadCount = useNotificationStore(state => 
    currentUser ? state.getUnreadCount(currentUser.id, currentUser.role, currentUser.province) : 0
  );
  const resources = useResourceStore(state => state.resources);
  const applications = useApplicationStore(state => 
    currentUser ? state.applications.filter(a => a.phone === currentUser.phone) : []
  );

  const myApplication = applications[0];
  
  const myAgreement = useMemo(() => {
    if (!myApplication) return null;
    return agreements.find(a => a.applicationId === myApplication.id);
  }, [agreements, myApplication]);

  const quickLinks = [
    { 
      icon: FileText, 
      label: '加盟协议', 
      path: '/store/agreement',
      color: 'from-blue-500 to-blue-600',
      badge: myAgreement?.status === 'signed_hq' ? '待签署' : undefined
    },
    { 
      icon: BookOpen, 
      label: '资料中心', 
      path: '/store/resources',
      color: 'from-green-500 to-green-600',
      count: resources.length
    },
    { 
      icon: Bell, 
      label: '通知中心', 
      path: '/store/notifications',
      color: 'from-orange-500 to-orange-600',
      badge: unreadCount > 0 ? `${unreadCount}条未读` : undefined
    },
  ];

  const stats = useMemo(() => [
    { 
      label: '加盟状态', 
      value: myApplication ? STAGE_LABELS[myApplication.currentStage] : '审核中',
      icon: Award,
      color: 'bg-blue-500'
    },
    { 
      label: '协议状态', 
      value: myAgreement ? (
        myAgreement.status === 'signed_both' ? '已签署' :
        myAgreement.status === 'signed_hq' ? '待签署' : '待生成'
      ) : '待生成',
      icon: FileText,
      color: 'bg-green-500'
    },
    { 
      label: '可用资料', 
      value: resources.length,
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    { 
      label: '未读通知', 
      value: unreadCount,
      icon: Bell,
      color: 'bg-orange-500'
    },
  ], [myApplication, myAgreement, resources.length, unreadCount]);

  const recentNotifications = notifications.slice(0, 3);
  const recentResources = resources.slice(0, 4);

  const getAgreementActionText = () => {
    if (!myAgreement) return { text: '协议待生成', color: 'text-gray-500' };
    if (myAgreement.status === 'pending') return { text: '等待总部签署', color: 'text-yellow-600' };
    if (myAgreement.status === 'signed_hq') return { text: '立即签署', color: 'text-orange-600' };
    if (myAgreement.status === 'signed_both') return { text: '查看协议', color: 'text-green-600' };
    return { text: '查看详情', color: 'text-blue-600' };
  };

  const agreementAction = getAgreementActionText();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                欢迎回来，{currentUser?.name}
              </h1>
              <p className="text-white/80 mt-1">
                {myApplication ? `${myApplication.city} 加盟商` : '意向加盟商'}
              </p>
            </div>
          </div>
          {myApplication && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white/70 text-sm">当前进度</p>
                <p className="text-xl font-bold mt-1">{STAGE_LABELS[myApplication.currentStage]}</p>
                <p className="text-white/60 text-sm mt-1">
                  最后更新：{formatRelativeTime(myApplication.lastProgressAt)}
                </p>
              </div>
              {myApplication.isDelayed && (
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">需要跟进</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {myAgreement?.status === 'signed_hq' && (
        <Link
          to="/store/agreement"
          className="block bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">加盟协议待签署</h3>
                <p className="text-sm text-gray-500">总部已完成签署，请您尽快完成签署</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              立即签署
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.path}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {link.badge && (
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                    {link.badge}
                  </span>
                )}
                {link.count !== undefined && !link.badge && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {link.count} 份
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{link.label}</h3>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              最新通知
            </h3>
            <Link
              to="/store/notifications"
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>暂无通知</p>
              </div>
            ) : (
              recentNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          notification.type === 'urgent' ? 'bg-red-100 text-red-600' :
                          notification.type === 'policy' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'training' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notification.type === 'urgent' ? '紧急' :
                           notification.type === 'policy' ? '政策' :
                           notification.type === 'training' ? '培训' : '系统'}
                        </span>
                        {!notification.readBy?.includes(currentUser?.id || '') && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                      </div>
                      <h4 className="font-medium text-gray-800 truncate">{notification.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{notification.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(notification.publishAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              推荐资料
            </h3>
            <Link
              to="/store/resources"
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentResources.map(resource => (
              <div 
                key={resource.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    resource.type === 'material' ? 'bg-blue-100 text-blue-600' :
                    resource.type === 'training' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{resource.title}</h4>
                    <p className="text-xs text-gray-500">
                      {resource.category} · {Math.round(resource.fileSize / 1024)} KB · {resource.downloads} 次下载
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {myApplication && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            申请进度
          </h3>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              {myApplication.stageHistory.map((record, index) => (
                <div key={index} className="flex flex-col items-center relative flex-1">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                    record.status === 'completed' 
                      ? 'bg-green-500 border-green-100 text-white' 
                      : record.status === 'processing'
                        ? 'bg-blue-500 border-blue-100 text-white animate-pulse'
                        : 'bg-gray-200 border-gray-100 text-gray-400'
                  }`}>
                    {record.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : record.status === 'processing' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  {index < myApplication.stageHistory.length - 1 && (
                    <div 
                      className={`absolute top-6 left-1/2 w-full h-1 -translate-y-1/2 ${
                        record.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <p className="mt-3 text-sm font-medium text-gray-800 text-center">
                    {STAGE_LABELS[record.stage]}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(record.startedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
