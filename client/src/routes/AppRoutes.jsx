import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../pages/auth/ResetPassword";
import Analyze from "../pages/app/Analyze";
import History from "../pages/app/History";
import Report from "../pages/app/Report";
import Dashboard from "../pages/app/Dashboard";
import Account from "../pages/app/Account";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import useApiAuth from "../hooks/useApiAuth";

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <h1>{title}</h1>
      <p style={{ color: "#888", marginTop: "10px" }}>
        This page is under development.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  useApiAuth();

  return (
    <Routes>
      {/* Public Website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PlaceholderPage title="Landing Page" />} />
        <Route path="/features" element={<PlaceholderPage title="Features" />} />
        <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
        <Route path="/preview" element={<PlaceholderPage title="Preview" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Application */}
      <Route element={<AppLayout />}>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/analyze" element={<Analyze />} />
        <Route path="/app/history" element={<History />} />
        <Route path="/app/report" element={<Report />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/account" element={<Account />} />
        </Route>
      </Route>

      {/* Password Reset */}
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}