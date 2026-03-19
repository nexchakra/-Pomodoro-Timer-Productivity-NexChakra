import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Timer from "../components/Timer";
import Task from "../components/Task";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import FocusMode from "./FocusMode";

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // 🔐 Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");

  const [showFocus, setShowFocus] = useState(false);

  // Load theme + auth
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserInitial(parsed.name?.charAt(0).toUpperCase() || "U");
        } catch {
          setUserInitial(user.charAt(0).toUpperCase());
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">

      {/* 🔥 NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            🍅Nexchakra Pomodoro
          </h1>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-200">

            <a href="#home">Home</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#analytics">Analytics</a>
            <a href="#timer">Timer</a>
            <a href="#tasks">Tasks</a>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="bg-red-500 text-white px-3 py-1 rounded">
                  Signup
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex gap-2">
            <button onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col p-4 gap-3 bg-white dark:bg-gray-800">
            <a href="#home">Home</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#analytics">Analytics</a>
            <a href="#timer">Timer</a>
            <a href="#tasks">Tasks</a>
          </div>
        )}
      </nav>

      {/* 🔥 HERO */}
      <section
        id="home"
        className="min-h-[90vh] flex flex-col justify-center items-center text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white">
          Stay Focused 🚀
        </h1>

        <p className="max-w-xl text-gray-600 dark:text-gray-300 mb-6">
          Boost productivity using Pomodoro. Track tasks, analyze progress,
          and build strong focus habits.
        </p>

        <div className="flex gap-4 flex-wrap">
          <a href="#timer" className="bg-red-500 text-white px-6 py-3 rounded-xl">
            Start Focus
          </a>

          <button
            onClick={() => setShowFocus(true)}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Focus Mode 🔥
          </button>
        </div>
      </section>

      {/* 🔥 MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Dashboard */}
        <section id="dashboard" className="scroll-mt-24">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold text-center mb-4">
              📊 Dashboard
            </h2>
            <Dashboard />
          </div>
        </section>

        {/* Analytics */}
        <section id="analytics" className="scroll-mt-24">
          <Analytics />
        </section>

        {/* Timer */}
        <section id="timer" className="scroll-mt-24">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-xl mx-auto">
            <h2 className="text-xl text-center mb-4">⏱️ Timer</h2>
            <Timer />
          </div>
        </section>

        {/* Tasks */}
        <section id="tasks" className="scroll-mt-24">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-2xl mx-auto">
            <h2 className="text-xl text-center mb-4">📝 Tasks</h2>
            <Task />
          </div>
        </section>

      </div>

      {/* 🔥 Focus Mode Overlay */}
      {showFocus && <FocusMode onClose={() => setShowFocus(false)} />}

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 dark:text-gray-400">
        © 2026  Nexchakra Pomodoro App • Built with ❤️
      </footer>
    </div>
  );
};

export default Home;