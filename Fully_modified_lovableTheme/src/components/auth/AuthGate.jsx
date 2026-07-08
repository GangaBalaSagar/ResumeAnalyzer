import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Sheet, PaperClip, Eyebrow } from "../paper.jsx";

/**
 * AuthGate — protects private routes while keeping the app shell intact.
 * If unauthenticated, redirects to /login and preserves the intended
 * destination in location.state.from.
 */
export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Sheet className="relative p-10">
          <PaperClip />
          <Eyebrow>One moment</Eyebrow>
          <div className="mt-3 font-serif text-2xl">Checking your credentials…</div>
          <div className="rule-line my-5" />
          <p className="text-sm text-ink-muted">
            We&apos;re checking your session. This should only take a moment.
          </p>
        </Sheet>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: { pathname: location.pathname, search: location.search } }}
      />
    );
  }

  return children;
}
