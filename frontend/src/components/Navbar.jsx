import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { getInitials } from "../utils/helpers";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-white hover:text-slate-900"
  }`;

const Navbar = ({ theme = "light", setTheme }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThanks = async () => {
    try {
      await axiosInstance.post(API_PATHS.THANKS.SEND, {
        message: "Thanks! This app is helping me prepare for interviews.",
      });
      toast.success("Thanks received. Keep going, you are doing great.");
    } catch {
      toast.error("Could not send thanks right now. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Interview Prep
            </p>
            <p className="text-sm text-slate-500">Practice with focus and speed</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1.5 md:flex">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setTheme?.((currentTheme) =>
                currentTheme === "dark" ? "light" : "dark",
              )
            }
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            aria-label="Toggle day and night mode"
          >
            {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            {theme === "dark" ? "Day" : "Night"}
          </button>

          <button
            type="button"
            onClick={handleThanks}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
          >
            Say Thanks
          </button>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
