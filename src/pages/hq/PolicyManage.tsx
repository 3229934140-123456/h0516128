import React, { useState } from 'react';
import { Plus, Search, FileText, Edit2, Trash2, Eye, EyeOff, X, Save, Type, AlignLeft, Image, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { formatDateTime } from '@/utils/date';
import type { PolicyType } from '@/types';

const typeOptions: { value: PolicyType; label: string; color: string }[] = [
  { value: 'brand', label: '品牌介绍', color: 'bg-blue-100 text-blue-700' },
  { value: 'policy', label: '加盟政策', color: 'bg-purple-100 text-purple-700' },
  { value: 'support', label: '支持体系', color: 'bg-green-100 text-green-700' },
];

export const PolicyManage: React.FC = () => {
  const { policies, createPolicy, updatePolicy, deletePolicy, togglePublish } = usePolicyStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<PolicyType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'brand' as PolicyType,
    content: '',
    coverImage: '',
  });

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editId) {
      updatePolicy(editId, formData);
    } else {
      createPolicy(formData);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (policy: typeof policies[0]) => {
    setFormData({
      title: policy.title,
      type: policy.type,
      content: policy.content,
      coverImage: policy.coverImage || '',
    });
    setEditId(policy.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'brand',
      content: '',
      coverImage: '',
    });
    setEditId(null);
  };

  const getTypeColor = (type: PolicyType) => {
    return typeOptions.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: PolicyType) => {
    return typeOptions.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            政策管理
          </h1>
          <p className="text-gray-500 mt-1">管理品牌介绍、加盟政策和支持体系等内容</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          新增政策
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索政策标题或内容..."
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
          {filteredPolicies.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">暂无政策内容</p>
            </div>
          ) : (
            filteredPolicies.map(policy => (
              <div key={policy.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(policy.type)}`}>
                        {getTypeLabel(policy.type)}
                      </span>
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        policy.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {policy.isPublished ? (
                          <><Eye className="w-3 h-3" /> 已发布</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> 草稿</>
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {policy.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {policy.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>创建时间：{formatDateTime(policy.createdAt)}</span>
                      {policy.updatedAt !== policy.createdAt && (
                        <span>更新时间：{formatDateTime(policy.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish(policy.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        policy.isPublished
                          ? 'hover:bg-green-50 text-green-600'
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                      title={policy.isPublished ? '取消发布' : '发布'}
                    >
                      {policy.isPublished ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(policy)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => deletePolicy(policy.id)}
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
                {editId ? '编辑政策' : '新增政策'}
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
                  政策类型
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                  <span className="flex items-center gap-1">
                    <Type className="w-4 h-4" />
                    政策标题
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入政策标题"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    封面图片链接 <span className="text-gray-400 font-normal">(可选)</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="请输入封面图片URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <AlignLeft className="w-4 h-4" />
                    政策内容
                  </span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入政策详细内容..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
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
                <Save className="w-4 h-4" />
                {editId ? '保存修改' : '保存政策'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
