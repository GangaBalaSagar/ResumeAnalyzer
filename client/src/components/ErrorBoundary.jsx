import { Component } from "react";
import { Link } from "react-router-dom";
import { Sheet, Eyebrow, PaperClip } from "./paper.jsx";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-desk flex items-center justify-center p-4">
          <Sheet className="w-full max-w-md p-8 md:p-12" lift dogEar>
            <PaperClip />
            <Eyebrow>Error</Eyebrow>
            <h1 className="mt-3 font-serif text-2xl md:text-3xl leading-tight">
              Something went wrong
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              An unexpected error occurred. The team has been notified.
            </p>
            <div className="rule-line my-6" />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-5 py-3 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Return Home
              </Link>
            </div>
          </Sheet>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;