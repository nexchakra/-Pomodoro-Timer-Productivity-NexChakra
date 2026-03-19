import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const Timer: React.FC = () => {
  const [time, setTime] = useState<number>(1500);
  const [running, setRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<"focus" | "short_break" | "long_break">("focus");
  const [cycle, setCycle] = useState<number>(1);
  const [sessions, setSessions] = useState<number>(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 🔥 LOAD SAVED STATE
  useEffect(() => {
    const savedTime = localStorage.getItem("time");
    const savedMode = localStorage.getItem("mode");
    const savedCycle = localStorage.getItem("cycle");

    if (savedTime) setTime(Number(savedTime));
    if (savedMode) setMode(savedMode as any);
    if (savedCycle) setCycle(Number(savedCycle));
  }, []);

  // 🔥 SAVE STATE
  useEffect(() => {
    localStorage.setItem("time", time.toString());
    localStorage.setItem("mode", mode);
    localStorage.setItem("cycle", cycle.toString());
  }, [time, mode, cycle]);

  // 🔔 Notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ⏱️ TIMER
  useEffect(() => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // 🔥 HANDLE END LOGIC (FIXED WITH useCallback)
  const handleEnd = useCallback(() => {
    setRunning(false);

    // 🔊 Sound
    new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    ).play();

    // 🔔 Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Pomodoro Complete!", {
        body: `${mode.replace("_", " ")} finished`,
      });
    }

    // ✅ Save focus session
    if (mode === "focus") {
      setSessions((prev) => prev + 1);

      if (API_URL) {
        fetch(`${API_URL}/sessions/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "focus",
            duration: 1500,
            completed: true,
            date: new Date(),
          }),
        });
      }
    }

    // 🔄 AUTO SWITCH
    if (mode === "focus") {
      if (cycle % 4 === 0) {
        setMode("long_break");
        setTime(900);
      } else {
        setMode("short_break");
        setTime(300);
      }
    } else {
      setMode("focus");
      setTime(1500);
      setCycle((prev) => prev + 1);
    }
  }, [mode, cycle]);

  // 🔥 WHEN TIME ENDS
  useEffect(() => {
    if (time === 0) {
      handleEnd();
    }
  }, [time, handleEnd]);

  // ⏱️ FORMAT
  const formatTime = (t: number) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // 🎯 CHANGE MODE
  const changeMode = (newMode: "focus" | "short_break" | "long_break") => {
    setRunning(false);
    setMode(newMode);

    if (newMode === "focus") setTime(1500);
    if (newMode === "short_break") setTime(300);
    if (newMode === "long_break") setTime(900);
  };

  return (
    <div className="w-full flex flex-col items-center text-center">

      {/* 🔥 MODE SWITCH */}
      <div className="flex gap-2 mb-5 flex-wrap justify-center">
        {["focus", "short_break", "long_break"].map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === m
                ? m === "focus"
                  ? "bg-red-500 text-white"
                  : m === "short_break"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {m.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* ⏱️ TIMER */}
      <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
        {formatTime(time)}
      </h1>

      {/* 📊 INFO */}
      <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <p>Cycle: {cycle}</p>
        <p>Sessions: {sessions}</p>
      </div>

      {/* 🎮 CONTROLS */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">

        <button
          onClick={() => setRunning(true)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
        >
          Pause
        </button>

        <button
          onClick={() => {
            setRunning(false);
            setTime(1500);
            setMode("focus");
            setCycle(1);
            setSessions(0);
            localStorage.clear();
          }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Reset
        </button>

      </div>
    </div>
  );
};

export default Timer;