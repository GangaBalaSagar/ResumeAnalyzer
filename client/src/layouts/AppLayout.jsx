import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <aside>Sidebar placeholder</aside>
      <div>
        <header>Topbar placeholder</header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
