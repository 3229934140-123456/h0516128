import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, MapPin, Users, Clock, AlertTriangle, 
  CheckCircle, DollarSign, X, ArrowRight, Search 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useDataStore } from '@/store/useDataStore';
import { formatWan, formatPercent, formatCurrency } from '@/utils/format';
import { formatDate, formatDateTime } from '@/utils/date';
import { STAGE_LABELS } from '@/types';
import type { ApplicationStage, Application } from '@/types';

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#6b7280', '#ef4444'];

// 统一签约判断逻辑：进入开店筹备或已完成阶段，且lastProgressAt在指定月份
const getSigningsInMonth = (applications: Application[], year: number, month: number) => {
  return applications.filter(a => {
    if (a.currentStage !== 'preparation' && a.currentStage !== 'completed') return false;
    const d = new Date(a.lastProgressAt || a.updatedAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });
};

export const DataBoard: React.FC = () => {
  const navigate = useNavigate();
  const applications = useApplicationStore(state => state.applications);
  const stats = useDataStore(state => state.getDashboardStats());
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [signingMonth, setSigningMonth] = useState<{ year: number; month: number } | null>(null);
  const [signingSearch, setSigningSearch] = useState('');

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const cityData = useMemo(() => {
    const cityMap = new Map<string, number>();
    applications.forEach(app => {
      cityMap.set(app.city, (cityMap.get(app.city) || 0) + 1);
    });
    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [applications]);

  const stageData = useMemo(() => {
    const stages: ApplicationStage[] = ['initial', 'review', 'contract', 'preparation', 'completed'];
    return stages.map(stage => ({
      stage: STAGE_LABELS[stage],
      count: applications.filter(a => a.currentStage === stage).length,
    }));
  }, [applications]);

  const conversionData = useMemo(() => {
    const stages: ApplicationStage[] = ['initial', 'review', 'contract', 'preparation', 'completed'];
    const result = [];
    let prevCount = applications.length;
    
    for (let i = 0; i < stages.length; i++) {
      const currentCount = applications.filter(a => 
        stages.indexOf(a.currentStage) >= i
      ).length;
      const rate = prevCount > 0 ? (currentCount / prevCount) * 100 : 0;
      
      result.push({
        stage: STAGE_LABELS[stages[i]],
        count: currentCount,
        rate: Math.round(rate * 10) / 10,
      });
      prevCount = currentCount;
    }
    return result;
  }, [applications]);

  const monthlyData = useMemo(() => {
    const months: { [key: string]: { year: number; month: number; applications: number; signings: number } } = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(thisYear, thisMonth - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { 
        year: date.getFullYear(), 
        month: date.getMonth(), 
        applications: 0, 
        signings: 0 
      };
    }

    applications.forEach(app => {
      const appDate = new Date(app.createdAt);
      const appMonthKey = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}`;
      if (months[appMonthKey]) {
        months[appMonthKey].applications++;
      }
      
      if (app.currentStage === 'preparation' || app.currentStage === 'completed') {
        const signDate = new Date(app.lastProgressAt || app.updatedAt);
        const signMonthKey = `${signDate.getFullYear()}-${String(signDate.getMonth() + 1).padStart(2, '0')}`;
        if (months[signMonthKey]) {
          months[signMonthKey].signings++;
        }
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month: month.substring(5) + '月',
      monthKey: month,
      year: data.year,
      monthNum: data.month,
      applications: data.applications,
      signings: data.signings,
    }));
  }, [applications, thisYear, thisMonth]);

  const investmentDistribution = useMemo(() => {
    const ranges = [
      { label: '10万以下', min: 0, max: 100000 },
      { label: '10-30万', min: 100000, max: 300000 },
      { label: '30-50万', min: 300000, max: 500000 },
      { label: '50-100万', min: 500000, max: 1000000 },
      { label: '100万以上', min: 1000000, max: Infinity },
    ];

    return ranges.map(range => ({
      range: range.label,
      count: applications.filter(a => 
        a.investmentAmount >= range.min && a.investmentAmount < range.max
      ).length,
    }));
  }, [applications]);

  const delayedByStage = useMemo(() => {
    const stages: ApplicationStage[] = ['initial', 'review', 'contract', 'preparation'];
    return stages.map(stage => ({
      stage: STAGE_LABELS[stage],
      delayed: applications.filter(a => a.currentStage === stage && a.isDelayed).length,
      total: applications.filter(a => a.currentStage === stage).length,
    })).filter(s => s.total > 0);
  }, [applications]);

  // 本月签约明细（和月度趋势、顶部指标使用统一逻辑）
  const signedThisMonth = useMemo(() => 
    getSigningsInMonth(applications, thisYear, thisMonth)
  , [applications, thisYear, thisMonth]);

  // 弹窗中显示的明细
  const modalSignings = useMemo(() => {
    if (!signingMonth) return [];
    const list = getSigningsInMonth(applications, signingMonth.year, signingMonth.month);
    return list.filter(a => 
      a.applicantName.toLowerCase().includes(signingSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(signingSearch.toLowerCase())
    );
  }, [applications, signingMonth, signingSearch]);

  const signedTotal = applications.filter(a => 
    a.currentStage === 'contract' || 
    a.currentStage === 'preparation' || 
    a.currentStage === 'completed'
  ).length;

  const keyMetrics = useMemo(() => {
    const total = applications.length;
    const totalInvestment = applications.reduce((sum, a) => sum + a.investmentAmount, 0);
    const avgInvestment = total > 0 ? totalInvestment / total : 0;
    
    return [
      { 
        label: '总申请数', 
        value: total, 
        icon: Users, 
        color: 'blue',
        clickable: false
      },
      { 
        label: '本月新增签约', 
        value: signedThisMonth.length, 
        icon: TrendingUp, 
        color: 'green',
        clickable: true,
        onClick: () => {
          setSigningMonth({ year: thisYear, month: thisMonth });
          setShowSigningModal(true);
        }
      },
      { 
        label: '累计签约数', 
        value: signedTotal, 
        icon: CheckCircle, 
        color: 'purple',
        clickable: false
      },
      { 
        label: '平均投资额', 
        value: formatWan(avgInvestment), 
        icon: DollarSign, 
        color: 'orange',
        clickable: false
      },
    ];
  }, [applications, signedThisMonth, signedTotal, thisYear, thisMonth]);

  const handleMonthClick = (data: any) => {
    setSigningMonth({ year: data.year, month: data.monthNum });
    setShowSigningModal(true);
  };

  const getMonthLabel = () => {
    if (!signingMonth) return '';
    return `${signingMonth.year}年${signingMonth.month + 1}月`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          数据看板
        </h1>
        <p className="text-gray-500 mt-1">全方位分析招商数据，洞察业务趋势</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
          }[metric.color as keyof typeof colorClasses];
          
          return (
            <div 
              key={index} 
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all ${
                metric.clickable ? 'cursor-pointer hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5' : ''
              }`}
              onClick={metric.clickable ? metric.onClick : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
                    {metric.clickable && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                        查看明细
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              月度趋势
            </h3>
            <span className="text-xs text-gray-400">点击签约数可查看明细</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    if (name === '签约数') {
                      return [`${value} 单（点击查看明细）`, name];
                    }
                    return [`${value} ${name === '申请数' ? '人' : '单'}`, name];
                  }}
                />
                <Legend 
                  onClick={(e: any) => {
                    if (e.value === '签约数') {
                      const item = monthlyData.find(m => m.monthKey === e.payload.payload.monthKey);
                      if (item) handleMonthClick(item);
                    }
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  name="申请数" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="signings" 
                  name="签约数" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 5, cursor: 'pointer' }}
                  activeDot={{ r: 7, cursor: 'pointer', onClick: (e: any, props: any) => {
                    const item = monthlyData[props.index];
                    if (item) handleMonthClick(item);
                  }}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            城市意向分布 TOP10
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis 
                  dataKey="city" 
                  type="category" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value} 人`, '申请数']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {cityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index < 3 ? '#f97316' : '#3b82f6'}
                      fillOpacity={index < 3 ? 1 : 0.7 - index * 0.05}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">阶段分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} 人`, name]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stageData.filter(d => d.count > 0).map((item, index) => (
              <div key={item.stage} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{item.stage}</span>
                <span className="text-sm font-semibold text-gray-800 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">阶段转化率</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="stage" stroke="#9ca3af" fontSize={10} tick={{ fill: '#6b7280' }} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'rate' ? `${value}%` : value,
                    name === 'rate' ? '留存率' : '人数'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            各阶段留存率（进入该阶段的人数 / 上一阶段人数）
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">投资金额分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="range" stroke="#9ca3af" fontSize={10} tick={{ fill: '#6b7280' }} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value} 人`, '申请数']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {stats.delayedApplications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            延迟申请分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayedByStage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="stage" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total" name="总数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="delayed" name="延迟" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">延迟申请列表</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.delayedApplications.slice(0, 5).map(app => (
                  <div 
                    key={app.id} 
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => navigate(`/hq/applications/${app.id}`)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{app.applicantName}</p>
                      <p className="text-sm text-gray-500">{app.city} · {STAGE_LABELS[app.currentStage]}</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                      延迟
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSigningModal && signingMonth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {getMonthLabel()} 签约明细
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  共 <span className="font-semibold text-green-600">{modalSignings.length}</span> 位加盟商本月完成签约
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSigningModal(false);
                  setSigningSearch('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索加盟商名称或城市..."
                  value={signingSearch}
                  onChange={(e) => setSigningSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
              {modalSignings.length === 0 ? (
                <div className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400">
                    {signingSearch ? '暂无匹配的签约记录' : '本月暂无签约记录'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {modalSignings.map((app, idx) => (
                    <div 
                      key={app.id}
                      className="p-5 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                      onClick={() => navigate(`/hq/applications/${app.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-lg font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">{app.applicantName}</h4>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              {STAGE_LABELS[app.currentStage]}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{app.city}</span>
                            <span>投资 {formatCurrency(app.investmentAmount)}</span>
                            <span>签约时间 {formatDateTime(app.lastProgressAt || app.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 hover:text-green-600 transition-colors">
                        <span className="text-sm">查看详情</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                顶部指标：<span className="font-semibold text-green-600">本月新增签约 {signedThisMonth.length}</span>
                <span className="mx-2">·</span>
                月度趋势：<span className="font-semibold text-orange-600">{getMonthLabel()} 签约 {modalSignings.length}</span>
              </p>
              <button
                onClick={() => {
                  setShowSigningModal(false);
                  setSigningSearch('');
                }}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
