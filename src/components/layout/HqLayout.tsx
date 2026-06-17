import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Bell, 
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDelayedCheck } from '@/hooks/useDelayedCheck';

interface HqLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/hq/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/hq/applications', label: '申请管理', icon: FileText },
  { path: '/hq/databoard', label: '数据看板', icon: BarChart3 },
  { path: '/hq/notifications', label: '通知管理', icon: Bell },
  { path: '/hq/policies', label: '政策管理', icon: Settings },
];

export const HqLayout: React.FC<HqLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const logout = useAuthStore(state => state.logout);
  const { delayedApps } = useDelayedCheck();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } ${!sidebarOpen && 'lg:translate-x-0 -translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <Link to="/hq/dashboard" className={`flex items-center gap-3 ${!sidebarOpen && 'lg:justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  招商管理系统
                </span>
              )}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:block hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const hasBadge = item.path === '/hq/applications' && delayedApps.length > 0;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!sidebarOpen && 'lg:justify-center'}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {hasBadge && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                          {delayedApps.length}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:justify-center'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.role === 'admin' ? '总部管理员' : '招商专员'}
                  </p>
                </div>
              )}
              {sidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            {delayedApps.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm">
                <Bell className="w-4 h-4 animate-pulse" />
                <span>{delayedApps.length} 个申请需跟进</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">欢迎回来，</span>
              <span className="text-sm font-semibold text-gray-800">{currentUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
