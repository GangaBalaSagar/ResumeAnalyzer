import { Routes, Route } from "react-router-dom";
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

      {/* Authenticated shell — pathless layout route.
          Any path listed here mounts inside AppLayout via <Outlet />. */}
      <Route
        element={
          <AuthGate>
            <AppLayout />
          </AuthGate>
        }
      >
        <Route path="/app" element={<Dashboard />} />
        <Route path="/upload" element={<Analyze />} />
        <Route path="/analysis" element={<Report />} />
        <Route path="/archive" element={<History />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
