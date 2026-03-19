import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    if (password.length > 8) return "Strong 💪";
    if (password.length > 5) return "Medium ⚡";
    return "Weak ⚠️";
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://pomodoro-timer-system-backend.onrender.com/auth/register",
        { name, email, password }
      );

      alert("Signup successful 🎉");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* 🔥 LEFT SIDE (NOW VISIBLE ON MOBILE) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-green-500 to-emerald-600 text-white flex flex-col justify-center items-center px-6 py-10">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
          🚀 Join  Nexchakra Pomodoro
        </h1>

        <p className="text-xs sm:text-sm md:text-lg text-center max-w-md leading-relaxed">
          Start your productivity journey today. Build focus habits,
          manage tasks, and achieve your goals faster.
        </p>

        <div className="mt-4 md:mt-6 space-y-1 md:space-y-2 text-[11px] sm:text-xs md:text-sm opacity-90 text-center">
          <p>✔ Track focus sessions</p>
          <p>✔ Manage tasks efficiently</p>
          <p>✔ Analyze productivity</p>
          <p>✔ Stay consistent daily</p>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8 sm:px-6">

        <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition hover:shadow-2xl">

          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Create Account ✨
          </h2>

          <p className="text-center text-gray-500 dark:text-gray-400 mb-5 text-xs sm:text-sm">
            Start focusing better and achieving more 🚀
          </p>

          {/* Name */}
          <div className="mb-3">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            <input
              placeholder="Enter your name"
              className="w-full mt-1 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>

            <div className="flex items-center gap-2 mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className="flex-1 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs px-2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="text-[10px] mt-1 text-gray-400">
              Strength: {getStrength()}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition mt-4 text-sm font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* Login */}
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-500 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>

          <p className="text-center text-[10px] text-gray-400 mt-5">
            Stay focused. Stay consistent 🍅
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;