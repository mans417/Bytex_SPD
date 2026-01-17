import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import NotFound from "pages/NotFound";
import RoleSelection from './pages/role-selection';
import StaffBilling from './pages/staff-billing';
import StaffBillHistory from './pages/staff-bill-history';
import OwnerDashboard from './pages/owner-dashboard';
import SalesAnalytics from './pages/sales-analytics';
import SecureLoginSetup from './pages/secure-login-setup';
import Login from './pages/login';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/staff-billing"
              element={
                <ProtectedRoute allowedRoles={['staff', 'owner']}>
                  <StaffBilling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-bill-history"
              element={
                <ProtectedRoute allowedRoles={['staff', 'owner']}>
                  <StaffBillHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-analytics"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <SalesAnalytics />
                </ProtectedRoute>
              }
            />

            <Route path="/secure-login-setup" element={<SecureLoginSetup />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
