import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorBoundary.css";

function ErrorBoundaryFallback({ onReload, onGoToDashboard }) {
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
          <button type="button" onClick={onGoToDashboard} className="error-boundary-button error-boundary-secondary">
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

  handleGoToDashboard = () => {
    this.props.navigate("/app/dashboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          onReload={this.handleReload}
          onGoToDashboard={this.handleGoToDashboard}
        />
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper(props) {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
}
