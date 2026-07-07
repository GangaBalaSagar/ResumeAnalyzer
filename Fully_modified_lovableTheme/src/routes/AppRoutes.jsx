import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import Features from "../pages/Features.jsx";
import FAQ from "../pages/FAQ.jsx";

import NotFound from "../pages/NotFound.jsx";
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import AuthGate from "../components/auth/AuthGate.jsx";
import AppLayout from "../components/app/AppLayout.jsx";
import Dashboard from "../pages/app/Dashboard.jsx";
import Analyze from "../pages/app/Analyze.jsx";
import Report from "../pages/app/Report.jsx";
import History from "../pages/app/History.jsx";
import Account from "../pages/app/Account.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Auth (public) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/analyze" element={<Analyze />} />
        <Route path="/app/report" element={<Report />} />
        <Route path="/app/history" element={<History />} />
        <Route path="/app/dashboard" element={<AuthGate><Dashboard /></AuthGate>} />
        <Route path="/app/account" element={<AuthGate><Account /></AuthGate>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
