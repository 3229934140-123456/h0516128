import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, Video, BookOpen, Package, ChevronRight, Eye, Clock, Star } from 'lucide-react';
import { useResourceStore } from '@/store/useResourceStore';
import { formatFileSize } from '@/utils/format';
import { formatDate } from '@/utils/date';
import type { ResourceType } from '@/types';

const typeFilters: { value: ResourceType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: '全部', icon: FileText },
  { value: 'material', label: '物料清单', icon: Package },
  { value: 'training', label: '培训视频', icon: Video },
  { value: 'manual', label: '运营手册', icon: BookOpen },
];

const categoryFilters = [
  { value: 'all', label: '全部分类' },
  { value: '开业指导', label: '开业指导' },
  { value: '产品知识', label: '产品知识' },
  { value: '运营管理', label: '运营管理' },
  { value: '营销推广', label: '营销推广' },
  { value: '物料设计', label: '物料设计' },
];

export const ResourceCenter: React.FC = () => {
  const { resources, downloadResource } = useResourceStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [resources, searchKeyword, typeFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: resources.length,
    material: resources.filter(r => r.type === 'material').length,
    training: resources.filter(r => r.type === 'training').length,
    manual: resources.filter(r => r.type === 'manual').length,
  }), [resources]);

  const handleDownload = (id: string, fileUrl: string, title: string) => {
    downloadResource(id);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = title;
    a.click();
  };

  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case 'material': return 'bg-blue-100 text-blue-600';
      case 'training': return 'bg-purple-100 text-purple-600';
      case 'manual': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'material': return Package;
      case 'training': return Video;
      case 'manual': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          资料中心
        </h1>
        <p className="text-gray-500 mt-1">下载总部下发的物料、培训资料和运营手册</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {typeFilters.map(filter => {
          const Icon = filter.icon;
          const count = filter.value === 'all' ? stats.total : stats[filter.value as keyof typeof stats];
          return (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                typeFilter === filter.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${
                  typeFilter === filter.value ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <span className={`text-2xl font-bold ${
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
                placeholder="搜索资料名称或分类..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categoryFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setCategoryFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    categoryFilter === filter.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">暂无资料</p>
            </div>
          ) : (
              filteredResources.map(resource => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div 
                    key={resource.id}
                    className="p-6 hover:bg-orange-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        <TypeIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                            {resource.type === 'material' ? '物料' :
                             resource.type === 'training' ? '培训' : '手册'}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            {resource.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(resource.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {formatFileSize(resource.fileSize)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {resource.downloads} 次下载
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(resource.id, resource.fileUrl, resource.title)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
                        >
                          <Download className="w-4 h-4" />
                          下载
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            共 <span className="font-semibold text-gray-800">{filteredResources.length}</span> 份资料
          </p>
        </div>
      </div>
    </div>
  );
};
