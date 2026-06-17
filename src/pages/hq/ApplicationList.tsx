import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Phone, Clock, AlertTriangle, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StageBadge } from '@/components/business/StageBadge';
import { formatDate, formatRelativeTime } from '@/utils/date';
import { formatCurrency, maskPhone } from '@/utils/format';
import type { Application, ApplicationStage } from '@/types';
import { STAGE_LABELS } from '@/types';

const stageFilters: { value: ApplicationStage | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'initial', label: '初步接触' },
  { value: 'review', label: '资质审核' },
  { value: 'contract', label: '签约阶段' },
  { value: 'preparation', label: '开店筹备' },
  { value: 'completed', label: '已完成' },
  { value: 'rejected', label: '已拒绝' },
];

const sortOptions = [
  { value: 'createdAt_desc', label: '最新申请' },
  { value: 'createdAt_asc', label: '最早申请' },
  { value: 'investmentAmount_desc', label: '投资金额高到低' },
  { value: 'investmentAmount_asc', label: '投资金额低到高' },
];

export const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const applications = useApplicationStore(state => state.applications);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stageFilter, setStageFilter] = useState<ApplicationStage | 'all'>('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(app =>
        app.applicantName.toLowerCase().includes(keyword) ||
        app.phone.includes(keyword) ||
        app.city.toLowerCase().includes(keyword)
      );
    }

    if (stageFilter !== 'all') {
      result = result.filter(app => app.currentStage === stageFilter);
    }

    if (showDelayedOnly) {
      result = result.filter(app => app.isDelayed);
    }

    const [field, order] = sortBy.split('_');
    result.sort((a, b) => {
      let comparison = 0;
      if (field === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (field === 'investmentAmount') {
        comparison = a.investmentAmount - b.investmentAmount;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [applications, searchKeyword, stageFilter, sortBy, showDelayedOnly]);

  const stats = useMemo(() => {
    const total = applications.length;
    const byStage = stageFilters.slice(1).map(filter => ({
      stage: filter.value,
      label: filter.label,
      count: applications.filter(a => a.currentStage === filter.value).length,
    }));
    const delayed = applications.filter(a => a.isDelayed).length;
    return { total, byStage, delayed };
  }, [applications]);

  const handleViewDetail = (id: string) => {
    navigate(`/hq/applications/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            申请管理
          </h1>
          <p className="text-gray-500 mt-1">管理所有意向加盟申请，跟进沟通记录</p>
        </div>
        <button
          onClick={() => navigate('/portal/apply')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          新增申请
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div
          onClick={() => setStageFilter('all')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
            stageFilter === 'all'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">全部申请</p>
        </div>
        {stats.byStage.map(item => (
          <div
            key={item.stage}
            onClick={() => setStageFilter(item.stage as ApplicationStage)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              stageFilter === item.stage
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="text-2xl font-bold text-gray-800">{item.count}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {stats.delayed > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-orange-700 font-medium">
              有 {stats.delayed} 个申请已超过7天未推进，请及时跟进
            </p>
          </div>
          <button
            onClick={() => setShowDelayedOnly(!showDelayedOnly)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showDelayedOnly
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-100'
            }`}
          >
            {showDelayedOnly ? '显示全部' : '只看延迟'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索申请人姓名、电话、城市..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>筛选</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>
                {filterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">阶段筛选</p>
                    {stageFilters.map(filter => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setStageFilter(filter.value as ApplicationStage | 'all');
                          setFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                          stageFilter === filter.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  申请人
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  意向城市
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  投资金额
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  当前阶段
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  招商专员
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  申请时间
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  最后跟进
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>没有找到匹配的申请记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    onViewDetail={handleViewDetail}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 <span className="font-semibold text-gray-800">{filteredApplications.length}</span> 条记录
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
              上一页
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ApplicationRowProps {
  application: Application;
  onViewDetail: (id: string) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ application, onViewDetail }) => {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${application.isDelayed ? 'bg-orange-50/50' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {application.applicantName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{application.applicantName}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {maskPhone(application.phone)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-800">{application.city}</p>
        <p className="text-sm text-gray-500">{application.province}</p>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-blue-600">{formatCurrency(application.investmentAmount)}</p>
        {application.storeArea && (
          <p className="text-sm text-gray-500">{application.storeArea}㎡</p>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <StageBadge stage={application.currentStage} status={application.stageStatus} />
          {application.isDelayed && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full animate-pulse">
              延迟
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-800">{application.assignedAgentName}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-800">{formatDate(application.createdAt)}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-800 flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          {formatRelativeTime(application.lastProgressAt)}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onViewDetail(application.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          查看详情
        </button>
      </td>
    </tr>
  );
};
