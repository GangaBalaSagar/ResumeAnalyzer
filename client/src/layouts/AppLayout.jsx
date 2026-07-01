import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <aside>Sidebar placeholder</aside>
        <div style={{ flex: 1 }}>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
