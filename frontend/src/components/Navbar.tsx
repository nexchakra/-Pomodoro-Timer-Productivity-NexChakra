import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface Props {
  dark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<Props> = ({ dark, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("");

  // 🔐 Sync auth state on route change (IMPORTANT)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user && user !== "undefined") {
      setUserInitial(user.trim().charAt(0).toUpperCase());
    } else {
      setUserInitial("");
    }
  }, [location]); // 🔥 updates on navigation

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔥 LOGOUT FIXED (Netlify safe)
  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
      
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* 🍅 Logo */}
        <Link
          to="/"
          className="text-lg md:text-xl font-bold text-gray-800 dark:text-white"
        >
          🍅 Pomodoro
        </Link>

        {/* 💻 Desktop */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-200 font-medium">

          <a href="#home" className="hover:text-red-500 transition">Home</a>
          <a href="#dashboard" className="hover:text-red-500 transition">Dashboard</a>
          <a href="#timer" className="hover:text-red-500 transition">Timer</a>
          <a href="#tasks" className="hover:text-red-500 transition">Tasks</a>

          {/* 🔐 AUTH */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white font-bold shadow">
                {userInitial || "U"}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-500 transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Signup
              </Link>
            </>
          )}

          {/* 🌙 Theme */}
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg hover:scale-105 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* 📱 Mobile */}
        <div className="md:hidden flex items-center gap-2">

          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            className="text-2xl text-gray-800 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 flex flex-col gap-3 text-gray-700 dark:text-gray-200 animate-fadeIn">

          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
          <a href="#timer" onClick={() => setMenuOpen(false)}>Timer</a>
          <a href="#tasks" onClick={() => setMenuOpen(false)}>Tasks</a>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white">
                  {userInitial || "U"}
                </div>
                <span>Account</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;