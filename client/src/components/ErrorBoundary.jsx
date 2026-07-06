import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorBoundary.css";

function ErrorBoundaryFallback({ onReload }) {
  return (
    <div className="error-boundary-shell">
      <div className="error-boundary-card">
        <h2 className="error-boundary-title">Something went wrong</h2>
        <p className="error-boundary-copy">
          We encountered an unexpected error while loading this page. Please try again, or return to the dashboard.
        </p>
        <div className="error-boundary-actions">
          <button type="button" onClick={onReload} className="error-boundary-button error-boundary-primary">
            Reload Page
          </button>
<button type="button" onClick={() => {
            const navigate = useNavigate();
            navigate("/app/dashboard");
          }} className="error-boundary-button error-boundary-secondary">
          Go to Dashboard
        </button>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  // Removed navigate handler – navigation now handled inside fallback via hook

  render() {
    if (this.state.hasError) {
      return (
<ErrorBoundaryFallback
            onReload={this.handleReload}
          />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
