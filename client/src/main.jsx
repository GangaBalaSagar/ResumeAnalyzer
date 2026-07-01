import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import AuthModal from "./components/auth/AuthModal";
import AppRoutes from "./routes/AppRoutes";
import "./styles.css";

// Clear any stale auth message on fresh application start
sessionStorage.removeItem("authMessage");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <AppRoutes />
          <AuthModal />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
