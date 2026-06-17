import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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

const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[];
}) => {
  const currentUser = useAuthStore(state => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin' || currentUser.role === 'agent') {
      return <Navigate to="/hq/dashboard" replace />;
    } else if (currentUser.role === 'franchisee') {
      return <Navigate to="/store/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

const AutoRedirect = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  
  if (currentUser) {
    if (currentUser.role === 'admin' || currentUser.role === 'agent') {
      return <Navigate to="/hq/dashboard" replace />;
    } else if (currentUser.role === 'franchisee') {
      return <Navigate to="/store/dashboard" replace />;
    }
  }
  
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  useDelayedCheck();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/portal" element={<PortalHome />} />
      <Route path="/portal/apply" element={<ApplicationForm />} />
      <Route path="/portal/success" element={<ApplySuccess />} />
      
      <Route path="/" element={<AutoRedirect />}>
        <Route path="hq" element={
          <ProtectedRoute allowedRoles={['admin', 'agent']}>
            <HqLayout>
              <Routes>
                <Route path="dashboard" element={<HqDashboard />} />
                <Route path="applications" element={<ApplicationList />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="databoard" element={<DataBoard />} />
                <Route path="notifications" element={<NotificationManage />} />
                <Route path="policies" element={<PolicyManage />} />
                <Route path="agreements/:id" element={<AgreementDetail />} />
              </Routes>
            </HqLayout>
          </ProtectedRoute>
        } />
        
        <Route path="store" element={
          <ProtectedRoute allowedRoles={['franchisee']}>
            <StoreLayout>
              <Routes>
                <Route path="dashboard" element={<StoreDashboard />} />
                <Route path="agreement" element={<StoreAgreement />} />
                <Route path="agreement/:id" element={<StoreAgreement />} />
                <Route path="resources" element={<ResourceCenter />} />
                <Route path="notifications" element={<StoreNotifications />} />
                <Route path="profile" element={<StoreProfile />} />
              </Routes>
            </StoreLayout>
          </ProtectedRoute>
        } />
      </Route>
      
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
