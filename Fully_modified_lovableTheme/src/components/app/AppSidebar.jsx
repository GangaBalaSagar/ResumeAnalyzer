import { NavLink } from "react-router-dom";
import { PaperClip, Eyebrow } from "../paper.jsx";

/**
 * AppSidebar — a paper "index card" pinned to the desk.
 * A tall Sheet with an eyebrow header, a paper-clipped section list,
 * and a footer note. Reuses .sheet, .rule-line, PaperClip and .eyebrow.
 */
export const APP_NAV = [
  { to: "/app", label: "Dashboard", num: "01", end: true },
  { to: "/upload", label: "Analyze", num: "02" },
  { to: "/archive", label: "Past Analyses", num: "03" },
  { to: "/account", label: "Account", num: "04" },
];

export default function AppSidebar({ onNavigate }) {
  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-24">
        <div className="sheet relative p-6">
          <PaperClip />
          <Eyebrow>Contents</Eyebrow>
          <div className="mt-2 font-serif text-lg leading-snug">
            Your desk
          </div>
          <div className="rule-line my-4" />

          <nav className="space-y-1">
            {APP_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-baseline gap-3 px-2 py-2 rounded-sm transition-colors ${
                    isActive
                      ? "bg-secondary text-ink"
                      : "text-ink-muted hover:text-ink hover:bg-secondary/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`font-serif text-sm ${
                        isActive ? "text-accent" : "text-ink-muted/60"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span className="font-serif text-[15px]">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="rule-line mt-6" />
          <div className="mt-4 eyebrow text-[10px]">Edition № 01</div>
          <div className="mt-1 font-serif italic text-[13px] text-ink-muted leading-snug">
            "Careful reading over quick judgment."
          </div>
        </div>
      </div>
    </aside>
  );
}
