import { PageContainer } from "../app/AppLayout.jsx";

/**
 * PublicAppLayout â€” shared content container for public application pages.
 * It reuses the same width and spacing rhythm as the private app shell,
 * without changing the public site chrome.
 */
export default function PublicAppLayout({ children }) {
  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8 md:py-10">
      <PageContainer>{children}</PageContainer>
    </main>
  );
}
