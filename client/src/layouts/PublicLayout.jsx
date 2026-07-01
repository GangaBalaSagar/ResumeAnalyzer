import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>Footer placeholder</footer>
    </div>
  );
}
