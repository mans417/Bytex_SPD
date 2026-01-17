import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RoleSelection from './pages/role-selection';
import StaffBilling from './pages/staff-billing';
import StaffBillHistory from './pages/staff-bill-history';
import OwnerDashboard from './pages/owner-dashboard';
import SalesAnalytics from './pages/sales-analytics';
import SecureLoginSetup from './pages/secure-login-setup';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/staff-billing" element={<StaffBilling />} />
        <Route path="/staff-bill-history" element={<StaffBillHistory />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/sales-analytics" element={<SalesAnalytics />} />
        <Route path="/secure-login-setup" element={<SecureLoginSetup />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
