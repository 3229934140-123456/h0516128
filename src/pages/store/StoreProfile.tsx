import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Building, Store, Save, Camera, Edit2, CheckCircle, FileText, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { formatDate } from '@/utils/date';
import { maskPhone, maskIdCard, formatWan } from '@/utils/format';
import { STAGE_LABELS } from '@/types';

export const StoreProfile: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const updateUser = useAuthStore(state => state.updateUser);
  const applications = useApplicationStore(state => 
    currentUser ? state.applications.filter(a => a.phone === currentUser.phone) : []
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
  });

  const myApplication = applications[0];

  const handleSave = () => {
    if (currentUser && formData.name.trim() && formData.phone.trim()) {
      updateUser(currentUser.id, formData);
      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            门店资料
          </h1>
          <p className="text-gray-500 mt-1">管理您的个人信息和门店资料</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
        >
          {isEditing ? (
            <><Save className="w-4 h-4" /> 保存资料</>
          ) : (
            <><Edit2 className="w-4 h-4" /> 编辑资料</>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              <span className="text-4xl font-bold">{currentUser.name.charAt(0)}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-orange-500" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {currentUser.name}
            </h2>
            <p className="text-white/80 mt-1 flex items-center gap-2">
              <Store className="w-4 h-4" />
              {myApplication ? `${myApplication.city} 加盟商` : '意向加盟商'}
            </p>
            {myApplication && (
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {STAGE_LABELS[myApplication.currentStage]}
                </span>
                <span className="text-white/70 text-sm">
                  加盟时间：{formatDate(myApplication.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            基本信息
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">姓名</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{currentUser.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">联系电话</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {maskPhone(currentUser.phone)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">电子邮箱</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {currentUser.email || '未设置'}
                </p>
              )}
            </div>

            {myApplication && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">身份证号</label>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {maskIdCard(myApplication.idCard)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">所在地区</label>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {myApplication.province} {myApplication.city}
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">账号类型</label>
              <p className="text-gray-800 font-medium">
                {currentUser.role === 'franchisee' ? '已签约加盟商' : '意向加盟商'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">注册时间</label>
              <p className="text-gray-800 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {myApplication && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-500" />
                加盟信息
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">申请编号</span>
                  <span className="font-medium text-gray-800">{myApplication.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">当前状态</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                    {STAGE_LABELS[myApplication.currentStage]}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">投资金额</span>
                  <span className="font-semibold text-orange-600">
                    {formatWan(myApplication.investmentAmount)} 元
                  </span>
                </div>
                {myApplication.storeArea && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500">意向店铺面积</span>
                    <span className="font-medium text-gray-800">{myApplication.storeArea} ㎡</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">负责专员</span>
                  <span className="font-medium text-gray-800">{myApplication.assignedAgentName}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">申请时间</span>
                  <span className="font-medium text-gray-800">{formatDate(myApplication.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">加盟保障</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    作为我们的加盟商，您将获得全方位的支持：
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      专业的开店指导和培训
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      统一的品牌形象和营销支持
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      持续的产品研发和技术更新
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      专属的区域保护政策
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


