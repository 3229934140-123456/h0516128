import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDelayedCheck } from "@/hooks/useDelayedCheck";
import { HqLayout } from "@/components/layout/HqLayout";
import { StoreLayout } from "@/components/layout/StoreLayout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { PortalHome } from "@/pages/portal/PortalHome";
import { ApplicationForm } from "@/pages/portal/ApplicationForm";
import { ApplySuccess } from "@/pages/portal/ApplySuccess";
import { HqDashboard } from "@/pages/hq/HqDashboard";
import { ApplicationList } from "@/pages/hq/ApplicationList";
import { ApplicationDetail } from "@/pages/hq/ApplicationDetail";
import { DataBoard } from "@/pages/hq/DataBoard";
import { NotificationManage } from "@/pages/hq/NotificationManage";
import { PolicyManage } from "@/pages/hq/PolicyManage";
import { AgreementDetail } from "@/pages/hq/AgreementDetail";
import { StoreDashboard } from "@/pages/store/StoreDashboard";
import { StoreAgreement } from "@/pages/store/StoreAgreement";
import { ResourceCenter } from "@/pages/store/ResourceCenter";
import { StoreNotifications } from "@/pages/store/StoreNotifications";
import { StoreProfile } from "@/pages/store/StoreProfile";

const HqRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAuthStore(state => state.currentUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin' && currentUser.role !== 'agent') {
    return <Navigate to="/store/dashboard" replace />;
  }

  return <HqLayout>{children}</HqLayout>;
};

const StoreRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAuthStore(state => state.currentUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'franchisee') {
    return <Navigate to="/hq/dashboard" replace />;
  }

  return <StoreLayout>{children}</StoreLayout>;
};

const LoginRoute = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  if (currentUser) {
    if (currentUser.role === 'admin' || currentUser.role === 'agent') {
      return <Navigate to="/hq/dashboard" replace />;
    } else if (currentUser.role === 'franchisee') {
      return <Navigate to="/store/dashboard" replace />;
    }
  }

  return <Login />;
};

const AppRoutes = () => {
  useDelayedCheck();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginRoute />} />

      <Route path="/portal" element={<PortalHome />} />
      <Route path="/portal/apply" element={<ApplicationForm />} />
      <Route path="/portal/success" element={<ApplySuccess />} />

      <Route path="/hq/dashboard" element={
        <HqRoute>
          <HqDashboard />
        </HqRoute>
      } />
      <Route path="/hq/applications" element={
        <HqRoute>
          <ApplicationList />
        </HqRoute>
      } />
      <Route path="/hq/applications/:id" element={
        <HqRoute>
          <ApplicationDetail />
        </HqRoute>
      } />
      <Route path="/hq/databoard" element={
        <HqRoute>
          <DataBoard />
        </HqRoute>
      } />
      <Route path="/hq/notifications" element={
        <HqRoute>
          <NotificationManage />
        </HqRoute>
      } />
      <Route path="/hq/policies" element={
        <HqRoute>
          <PolicyManage />
        </HqRoute>
      } />
      <Route path="/hq/agreements/:id" element={
        <HqRoute>
          <AgreementDetail />
        </HqRoute>
      } />

      <Route path="/store/dashboard" element={
        <StoreRoute>
          <StoreDashboard />
        </StoreRoute>
      } />
      <Route path="/store/agreement" element={
        <StoreRoute>
          <StoreAgreement />
        </StoreRoute>
      } />
      <Route path="/store/agreement/:id" element={
        <StoreRoute>
          <StoreAgreement />
        </StoreRoute>
      } />
      <Route path="/store/resources" element={
        <StoreRoute>
          <ResourceCenter />
        </StoreRoute>
      } />
      <Route path="/store/notifications" element={
        <StoreRoute>
          <StoreNotifications />
        </StoreRoute>
      } />
      <Route path="/store/profile" element={
        <StoreRoute>
          <StoreProfile />
        </StoreRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  useEffect(() => {
    document.title = '企业招商加盟管理平台';
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
