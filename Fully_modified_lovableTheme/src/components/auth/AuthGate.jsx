import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Sheet, PaperClip, Eyebrow } from "../paper.jsx";
import PublicSite from "../public/PublicSite.jsx";

/**
 * AuthGate — protects a route. While the session is loading, shows a
 * paper-themed placeholder inside the same PublicSite shell used by the
 * marketing pages, so the header/footer never flicker between two designs.
 * If unauthenticated, redirects to /login and preserves the intended
 * destination in location.state.from.
 */
export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PublicSite>
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <Sheet className="relative p-10">
              <PaperClip />
              <Eyebrow>One moment</Eyebrow>
              <div className="mt-3 font-serif text-2xl">
                Checking your credentials…
              </div>
              <div className="rule-line my-5" />
              <p className="text-sm text-ink-muted">
                We're consulting the ledger. This should only take a breath.
              </p>
            </Sheet>
          </div>
        </div>
      </PublicSite>
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
