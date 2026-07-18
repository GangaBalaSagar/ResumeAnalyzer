import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ReportContext = createContext(undefined);
const STORAGE_KEY = "ra_current_report_id";

export function ReportProvider({ children }) {
  const [currentReportId, setId] = useState(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(STORAGE_KEY) || null;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentReportId) sessionStorage.setItem(STORAGE_KEY, currentReportId);
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [currentReportId]);

  const value = useMemo(
    () => ({
      currentReportId,
      setCurrentReportId: (id) => setId(id || null),
      clearCurrentReport: () => setId(null),
    }),
    [currentReportId]
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (ctx === undefined) throw new Error("useReport must be used within a ReportProvider");
  return ctx;
}
