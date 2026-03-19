import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("🔥 Login button clicked");

    if (!email || !password) {
      alert("Please fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://pomodoro-timer-system-backend.onrender.com/auth/login",
        {
          email,
          password,
        }
      );

      console.log("✅ Response:", res.data);

      // ✅ Validate response
      if (!res.data.token) {
        alert("Invalid email or password ❌");
        return;
      }

      // ✅ Save user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.name || "User");

      alert("Login successful 🎉");

      navigate("/");
    } catch (err: any) {
      console.error("❌ Error:", err);

      // Better error handling
      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Server not responding ❌";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* 🔥 LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-red-500 to-orange-500 text-white flex flex-col justify-center items-center px-6 py-10">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
          🍅 Pomodoro Focus
        </h1>

        <p className="text-xs sm:text-sm md:text-lg text-center max-w-md leading-relaxed">
          Boost your productivity using the Pomodoro technique. Stay focused,
          track your tasks, and achieve more every day.
        </p>

        <div className="mt-4 md:mt-6 space-y-1 md:space-y-2 text-[11px] sm:text-xs md:text-sm opacity-90 text-center">
          <p>✔ Smart Focus Timer</p>
          <p>✔ Task Management</p>
          <p>✔ Productivity Analytics</p>
          <p>✔ Focus Mode Experience</p>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8 sm:px-6">

        <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition hover:shadow-2xl">

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-center text-gray-500 dark:text-gray-400 mb-5 text-xs sm:text-sm">
            Login to continue your productivity journey 🚀
          </p>

          {/* Email */}
          <div className="mb-3">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-red-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>

            <div className="flex items-center gap-2 mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-red-400 dark:bg-gray-700 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs px-2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg transition mt-4 text-sm font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-red-500 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-[10px] text-gray-400 mt-5">
            Stay focused. Stay consistent 🍅
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;