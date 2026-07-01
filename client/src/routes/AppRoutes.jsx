import { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../pages/auth/ResetPassword";
import Analyze from "../pages/app/Analyze";
import History from "../pages/app/History";
import Report from "../pages/app/Report";
import { useAuthModal } from "../context/AuthModalContext";
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

function AuthRouteBridge({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, openLoginModal, openSignupModal, openForgotPasswordModal, closeAuthModal } =
    useAuthModal();
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (mode === "login") {
      openLoginModal();
    } else if (mode === "signup") {
      openSignupModal();
    } else if (mode === "forgot") {
      openForgotPasswordModal();
    }
  }, [mode, openLoginModal, openSignupModal, openForgotPasswordModal]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      if (
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/forgot-password"
      ) {
        navigate("/", { replace: true });
      }
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, location.pathname, navigate]);

  useEffect(() => {
    return () => {
      closeAuthModal();
    };
  }, [closeAuthModal]);

  return null;
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
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthRouteBridge mode="login" />} />
        <Route path="/signup" element={<AuthRouteBridge mode="signup" />} />
        <Route
          path="/forgot-password"
          element={<AuthRouteBridge mode="forgot" />}
        />
      </Route>

      {/* Protected Application */}
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/app/dashboard"
            element={<PlaceholderPage title="Dashboard" />}
          />
          <Route path="/app/analyze" element={<Analyze />} />
          <Route path="/app/history" element={<History />} />
          <Route path="/app/report" element={<Report />} />
          <Route
            path="/app/account"
            element={<PlaceholderPage title="Account" />}
          />
        </Route>
      </Route>

      {/* Password Reset */}
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}