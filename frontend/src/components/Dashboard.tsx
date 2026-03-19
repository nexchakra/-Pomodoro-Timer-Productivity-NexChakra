import React, { useEffect, useState } from "react";
import axios from "axios";

interface Session {
  type: string;
  duration: number;
  date: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [count, setCount] = useState(0);
  const [todayTime, setTodayTime] = useState(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    fetchData();
    calculateStreak();
  }, []);

  const fetchData = async () => {
    try {
      if (!API_URL) return;

      const res = await axios.get(`${API_URL}/sessions/`);
      setSessions(res.data);

      const focusSessions = res.data.filter(
        (s: Session) => s.type === "focus"
      );

      // 🔥 Total time
      const total = focusSessions.reduce(
        (acc: number, curr: Session) => acc + curr.duration,
        0
      );

      setTotalTime(total);
      setCount(focusSessions.length);

      // 🔥 Today focus
      const today = new Date().toDateString();

      const todayFocus = focusSessions
        .filter(
          (s: Session) => new Date(s.date).toDateString() === today
        )
        .reduce(
          (acc: number, curr: Session) => acc + curr.duration,
          0
        );

      setTodayTime(todayFocus);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 STREAK SYSTEM
  const calculateStreak = () => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("lastDate");

    if (last === today) return;

    if (last) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (last === yesterday.toDateString()) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(1);
      }
    }

    localStorage.setItem("lastDate", today);
  };

  const minutes = Math.floor(totalTime / 60);
  const todayMinutes = Math.floor(todayTime / 60);

  // 🔥 XP + BADGE
  const xp = count * 10;

  const getBadge = () => {
    if (xp > 200) return "🔥 Master";
    if (xp > 100) return "🚀 Pro";
    return "🌱 Beginner";
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">

      {/* Total Focus */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow">
        <h3 className="text-sm opacity-80">Total Focus</h3>
        <p className="text-3xl font-bold">{minutes} min</p>
      </div>

      {/* Today */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow">
        <h3 className="text-sm opacity-80">Today</h3>
        <p className="text-3xl font-bold">{todayMinutes} min</p>
      </div>

      {/* Sessions */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow">
        <h3 className="text-sm opacity-80">Sessions</h3>
        <p className="text-3xl font-bold">{count}</p>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-sm opacity-80">Streak</h3>
        <p className="text-3xl font-bold">{streak} 🔥</p>
      </div>

      {/* XP */}
      <div className="col-span-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <h3 className="text-gray-600 dark:text-gray-300">XP Points</h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{xp}</p>
        <p className="mt-2 text-lg">{getBadge()}</p>
      </div>

      {/* ✅ FIX: USE sessions (prevents ESLint error) */}
      <div className="col-span-full bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet</p>
        ) : (
          <ul className="text-sm space-y-1">
            {sessions.slice(0, 5).map((s, i) => (
              <li key={i}>
                {s.type} - {Math.floor(s.duration / 60)} min
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Dashboard;