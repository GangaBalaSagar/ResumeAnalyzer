import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      <nav>Navbar placeholder</nav>
      <main>
        <Outlet />
      </main>
      <footer>Footer placeholder</footer>
    </div>
  );
}
