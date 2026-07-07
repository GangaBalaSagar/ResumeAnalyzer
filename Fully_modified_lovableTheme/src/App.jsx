import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AuthModalProvider } from "./contexts/AuthModalContext.jsx";
import { ReportProvider } from "./contexts/ReportContext.jsx";
import useApiAuth from "./hooks/useApiAuth.js";
import AppRoutes from "./routes/AppRoutes.jsx";

function ApiAuthBridge() {
  useApiAuth();
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <ReportProvider>
          <ApiAuthBridge />
          <AppRoutes />
        </ReportProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}
