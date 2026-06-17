import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, MapPin, Users, Clock, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useDataStore } from '@/store/useDataStore';
import { formatWan, formatPercent } from '@/utils/format';
import { STAGE_LABELS } from '@/types';
import type { ApplicationStage } from '@/types';

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#6b7280', '#ef4444'];

export const DataBoard: React.FC = () => {
  const applications = useApplicationStore(state => state.applications);
  const stats = useDataStore(state => state.getDashboardStats());

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
    const months: { [key: string]: { applications: number; signings: number } } = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { applications: 0, signings: 0 };
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
      ...data,
    }));
  }, [applications]);

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

  const keyMetrics = useMemo(() => {
    const total = applications.length;
    const signed = applications.filter(a => 
      a.currentStage === 'contract' || 
      a.currentStage === 'preparation' || 
      a.currentStage === 'completed'
    ).length;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const signedThisMonth = applications.filter(a => {
      if (a.currentStage !== 'preparation' && a.currentStage !== 'completed') return false;
      const d = new Date(a.lastProgressAt || a.updatedAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    
    const totalInvestment = applications.reduce((sum, a) => sum + a.investmentAmount, 0);
    const avgInvestment = total > 0 ? totalInvestment / total : 0;
    
    return [
      { label: '总申请数', value: total, icon: Users, color: 'blue' },
      { label: '本月新增签约', value: signedThisMonth, icon: TrendingUp, color: 'green' },
      { label: '累计签约数', value: signed, icon: CheckCircle, color: 'purple' },
      { label: '平均投资额', value: formatWan(avgInvestment), icon: DollarSign, color: 'orange' },
    ];
  }, [applications]);

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
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{metric.value}</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            月度趋势
          </h3>
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
                />
                <Legend />
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
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
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
                  <div key={app.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
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
    </div>
  );
};
