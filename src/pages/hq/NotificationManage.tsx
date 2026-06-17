import React, { useState } from 'react';
import { Plus, Search, Bell, Users, MapPin, Target, Eye, Edit2, Trash2, X, Send, Calendar, ChevronDown } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDateTime } from '@/utils/date';
import type { NotificationType, NotificationTargetType } from '@/types';

const typeOptions: { value: NotificationType; label: string; color: string }[] = [
  { value: 'system', label: '系统通知', color: 'bg-blue-100 text-blue-700' },
  { value: 'policy', label: '政策通知', color: 'bg-purple-100 text-purple-700' },
  { value: 'training', label: '培训通知', color: 'bg-green-100 text-green-700' },
  { value: 'urgent', label: '紧急通知', color: 'bg-red-100 text-red-700' },
];

const targetOptions: { value: NotificationTargetType; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: '所有加盟商', icon: Users },
  { value: 'region', label: '指定区域', icon: MapPin },
  { value: 'specified', label: '指定加盟商', icon: Target },
];

const provinces = [
  '北京', '上海', '广东', '江苏', '浙江', '山东', '四川', '河南', '湖北', '湖南',
  '福建', '安徽', '河北', '陕西', '辽宁', '重庆', '江西', '天津', '云南', '广西',
];

export const NotificationManage: React.FC = () => {
  const { notifications, createNotification, deleteNotification, markAsRead } = useNotificationStore();
  const currentUser = useAuthStore(state => state.currentUser);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'system' as NotificationType,
    targetType: 'all' as NotificationTargetType,
    targetRegions: [] as string[],
    targetUserIds: [] as string[],
  });
  
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim() || !currentUser) return;

    if (editId) {
      // Update logic would go here
    } else {
      createNotification({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        targetType: formData.targetType,
        targetRegions: formData.targetRegions.length > 0 ? formData.targetRegions : undefined,
        targetUserIds: formData.targetUserIds.length > 0 ? formData.targetUserIds : undefined,
        publisherId: currentUser.id,
        publisherName: currentUser.name,
      });
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'system',
      targetType: 'all',
      targetRegions: [],
      targetUserIds: [],
    });
    setEditId(null);
  };

  const toggleRegion = (province: string) => {
    setFormData(prev => ({
      ...prev,
      targetRegions: prev.targetRegions.includes(province)
        ? prev.targetRegions.filter(r => r !== province)
        : [...prev.targetRegions, province],
    }));
  };

  const getTypeColor = (type: NotificationType) => {
    return typeOptions.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: NotificationType) => {
    return typeOptions.find(t => t.value === type)?.label || type;
  };

  const getTargetLabel = (notification: typeof notifications[0]) => {
    if (notification.targetType === 'all') return '所有加盟商';
    if (notification.targetType === 'region') return notification.targetRegions?.join('、') || '指定区域';
    return `${notification.targetUserIds?.length || 0} 位加盟商`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            通知管理
          </h1>
          <p className="text-gray-500 mt-1">向加盟商发布系统通知、政策更新和培训信息</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          发布通知
        </button>
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {typeOptions.map(type => (
                <button
                  key={type.value}
                  onClick={() => setTypeFilter(type.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    typeFilter === type.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">暂无通知记录</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                        {getTypeLabel(notification.type)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {getTargetLabel(notification)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateTime(notification.publishAt)}
                      </span>
                      <span>发布者：{notification.publisherName}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {notification.readCount}/{notification.totalCount} 已读
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAsRead(notification.id, 'admin')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editId ? '编辑通知' : '发布新通知'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通知类型
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {typeOptions.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                        formData.type === type.value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通知标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入通知标题"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通知内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入通知内容..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  接收对象
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {targetOptions.map(target => {
                    const Icon = target.icon;
                    return (
                      <button
                        key={target.value}
                        onClick={() => setFormData(prev => ({ ...prev, targetType: target.value }))}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                          formData.targetType === target.value
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {target.label}
                      </button>
                    );
                  })}
                </div>

                {formData.targetType === 'region' && (
                  <div className="relative">
                    <button
                      onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-left flex items-center justify-between"
                    >
                      <span className={formData.targetRegions.length === 0 ? 'text-gray-400' : 'text-gray-800'}>
                        {formData.targetRegions.length === 0
                          ? '请选择目标区域'
                          : `已选择 ${formData.targetRegions.length} 个省份`}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {regionDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10 max-h-60 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-2">
                          {provinces.map(province => (
                            <button
                              key={province}
                              onClick={() => toggleRegion(province)}
                              className={`py-1.5 px-2 rounded-lg text-sm transition-colors ${
                                formData.targetRegions.includes(province)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {province}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim() || !formData.content.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {editId ? '保存修改' : '发布通知'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
