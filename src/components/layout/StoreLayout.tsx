import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Bell, 
  User,
  Menu,
  X,
  LogOut,
  Store,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface StoreLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/store/dashboard', label: '工作台', icon: LayoutDashboard },
  { path: '/store/agreement', label: '加盟协议', icon: FileText },
  { path: '/store/resources', label: '资料中心', icon: BookOpen },
  { path: '/store/notifications', label: '通知中心', icon: Bell },
  { path: '/store/profile', label: '门店资料', icon: User },
];

export const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const logout = useAuthStore(state => state.logout);
  const unreadCount = useNotificationStore(state => 
    currentUser ? state.getUnreadCount(currentUser.id, currentUser.role, currentUser.province) : 0
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } ${!sidebarOpen && 'lg:translate-x-0 -translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gradient-to-r from-blue-500/5 to-transparent">
            <Link to="/store/dashboard" className={`flex items-center gap-3 ${!sidebarOpen && 'lg:justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  门店管理后台
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
              const hasBadge = item.path === '/store/notifications' && unreadCount > 0;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-400/25' 
                      : 'text-gray-600 hover:bg-orange-50'
                  } ${!sidebarOpen && 'lg:justify-center'}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {hasBadge && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          {unreadCount}
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">加盟商</p>
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
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Link 
                to="/store/notifications"
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100 transition-colors"
              >
                <Bell className="w-4 h-4 animate-pulse" />
                <span>{unreadCount} 条未读</span>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">欢迎，</span>
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
