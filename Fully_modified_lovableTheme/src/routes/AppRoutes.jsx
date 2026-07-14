import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import LandingV2 from "../pages/LandingV2.jsx";
import Features from "../pages/Features.jsx";
import FAQ from "../pages/FAQ.jsx";
import HeroPrototype from "../pages/HeroPrototype.jsx";
import PublicSite from "../components/public/PublicSite.jsx";
import PublicAppLayout from "../components/public/PublicAppLayout.jsx";
import HeroTest from "../pages/HeroTest.jsx";

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
      <Route path="/" element={<LandingV2 />} />
      <Route path="/landing-old" element={<Landing />} />
      <Route path="/landing-v2" element={<LandingV2 />} />
      <Route path="/hero-preview" element={<HeroPrototype />} />
      <Route path="/hero-test" element={<HeroTest />} />
      <Route path="/features" element={<Features />} />
      <Route path="/faq" element={<FAQ />} />
      <Route
        path="/analyze"
        element={
          <PublicSite>
            <PublicAppLayout>
              <Analyze />
            </PublicAppLayout>
          </PublicSite>
        }
      />
      <Route
        path="/report"
        element={
          <PublicSite>
            <PublicAppLayout>
              <Report />
            </PublicAppLayout>
          </PublicSite>
        }
      />
      <Route
        path="/history"
        element={
          <PublicSite>
            <PublicAppLayout>
              <History />
            </PublicAppLayout>
          </PublicSite>
        }
      />

      {/* Auth (public) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<AuthGate><AppLayout /></AuthGate>}>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/analyze" element={<Analyze />} />
        <Route path="/app/report" element={<Report />} />
        <Route path="/app/history" element={<History />} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/account" element={<Account />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
