import { Link } from "react-router-dom";
import PublicSite from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow } from "../components/paper.jsx";

export default function NotFound() {
  return (
    <PublicSite>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-xl mx-auto py-20 text-center">
          <Sheet className="p-10" lift>
            <Eyebrow>404 · Page not found</Eyebrow>
            <h1 className="mt-3 font-serif text-5xl">This page can't be found.</h1>
            <p className="mt-4 text-ink-muted">
              The page you're looking for isn't available.
            </p>
            <Link
              to="/"
              className="inline-block mt-8 px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Return home
            </Link>
          </Sheet>
        </div>
      </div>
    </PublicSite>
  );
}
