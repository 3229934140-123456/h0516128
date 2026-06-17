import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { StageBadge } from '@/components/business/StageBadge';
import { formatCurrency, formatWan } from '@/utils/format';
import { formatRelativeTime, formatDate } from '@/utils/date';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const HqDashboard: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const stats = useDataStore(state => state.getDashboardStats());
  const applications = useApplicationStore(state => state.applications);
  
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    pending: 0,
    signed: 0,
    rate: 0
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        total: Math.round(stats.totalApplications * progress),
        pending: Math.round(stats.pendingReview * progress),
        signed: Math.round(stats.signedThisMonth * progress),
        rate: stats.conversionRate * progress * 100
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [stats]);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: '总申请数',
      value: animatedStats.total,
      suffix: '',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+12.5%',
      trendUp: true
    },
    {
      label: '待审核',
      value: animatedStats.pending,
      suffix: '',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '-5.2%',
      trendUp: false
    },
    {
      label: '本月签约',
      value: animatedStats.signed,
      suffix: '',
      icon: FileCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+28.3%',
      trendUp: true
    },
    {
      label: '转化率',
      value: animatedStats.rate.toFixed(1),
      suffix: '%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: '+3.1%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            欢迎回来，{currentUser?.name}！
          </h1>
          <p className="text-white/70">
            今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          {stats.delayedApplications.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="text-sm">
                有 <strong className="text-orange-400">{stats.delayedApplications.length}</strong> 个申请超过7天未跟进，请及时处理
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div 
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                card.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800">
                {card.value}{card.suffix}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">月度趋势</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
              <option>近6个月</option>
              <option>近12个月</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  name="申请数" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="signings" 
                  name="签约数" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">城市意向分布 TOP 10</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis 
                  dataKey="city" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  stroke="#9ca3af"
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  name="申请数" 
                  fill="url(#colorGradient)"
                  radius={[0, 4, 4, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Delayed Applications & Recent Applications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delayed Applications */}
        {stats.delayedApplications.length > 0 && (
          <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">待跟进申请</h3>
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                {stats.delayedApplications.length}
              </span>
            </div>
            <div className="space-y-3">
              {stats.delayedApplications.slice(0, 5).map(app => (
                <Link 
                  key={app.id}
                  to={`/hq/applications/${app.id}`}
                  className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div>
                    <p className="font-medium text-gray-800">{app.applicantName}</p>
                    <p className="text-sm text-gray-500">
                      {app.province} · {app.city} · 意向{formatWan(app.investmentAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-500 font-medium">
                      已延迟 {formatRelativeTime(app.lastProgressAt)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <Link 
              to="/hq/applications?filter=delayed"
              className="mt-4 block text-center text-sm text-orange-600 font-medium hover:underline"
            >
              查看全部 →
            </Link>
          </div>
        )}

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">最新申请</h3>
            <Link 
              to="/hq/applications"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map(app => (
              <Link 
                key={app.id}
                to={`/hq/applications/${app.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">{app.applicantName}</p>
                    <StageBadge stage={app.currentStage} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {app.city} · {formatCurrency(app.investmentAmount)} · {formatRelativeTime(app.createdAt)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
