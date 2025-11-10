import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const link = ({ isActive }) =>
  `px-3 py-2 rounded ${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`;

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Nơi render các trang con */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
