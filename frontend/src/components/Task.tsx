import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface TaskType {
  _id?: string;
  title: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  pomodoros?: number;
  user?: string;
}

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [pomodoros, setPomodoros] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [adding, setAdding] = useState(false);

  const BASE_URL = "https://pomodoro-timer-system-backend.onrender.com";

  // 🔐 Get logged user safely
  const getUser = () => {
    const user = localStorage.getItem("user");
    if (!user) return "";

    try {
      const parsed = JSON.parse(user);
      return parsed.email || parsed.name || user;
    } catch {
      return user;
    }
  };

  // 📥 Fetch tasks (FIXED with useCallback)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const user = getUser();

      if (!user) return;

      const res = await axios.get(`${BASE_URL}/tasks/${user}`);
      setTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ➕ Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      setAdding(true);
      const user = getUser();

      await axios.post(`${BASE_URL}/tasks/`, {
        title,
        completed: false,
        priority,
        pomodoros,
        user,
      });

      setTitle("");
      setPriority("medium");
      setPomodoros(1);

      fetchTasks();
    } catch (err) {
      console.log("Add error:", err);
    } finally {
      setAdding(false);
    }
  };

  // ⌨️ Enter key support
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  // ✅ Toggle complete
  const toggleTask = async (task: TaskType) => {
    if (!task._id) return;

    await axios.put(`${BASE_URL}/tasks/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  // ❌ Delete
  const deleteTask = async (id?: string) => {
    if (!id) return;

    await axios.delete(`${BASE_URL}/tasks/${id}`);
    fetchTasks();
  };

  // ✏️ Save edit
  const saveEdit = async (id?: string) => {
    if (!id || !editText.trim()) return;

    await axios.put(`${BASE_URL}/tasks/edit/${id}`, {
      title: editText,
    });

    setEditId(null);
    setEditText("");
    fetchTasks();
  };

  // ✅ FIXED useEffect
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 🎨 Priority color
  const getPriorityColor = (p?: string) => {
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full">

      {/* 🔥 ADD TASK */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">

        <div className="flex flex-col gap-3">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter task and press Enter..."
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />

          <div className="flex flex-wrap gap-3">

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="px-3 py-2 rounded-lg dark:bg-gray-700"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="number"
              value={pomodoros}
              onChange={(e) => setPomodoros(Number(e.target.value))}
              className="w-20 px-2 py-2 rounded-lg dark:bg-gray-700"
              min={1}
            />

            <button
              onClick={addTask}
              disabled={adding}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
            >
              {adding ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">Loading...</p>
      )}

      {/* ❌ Empty */}
      {!loading && tasks.length === 0 && (
        <p className="text-center text-gray-500">
          No tasks yet 🚀
        </p>
      )}

      {/* 📋 TASK LIST */}
      <div className="flex flex-col gap-4">

        {tasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between gap-4 transition hover:scale-[1.01]
            ${task.completed ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"}`}
          >

            {/* LEFT */}
            <div className="flex flex-col flex-1">

              {editId === task._id ? (
                <div className="flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="px-2 py-1 rounded border flex-1"
                  />
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  className={`text-lg ${
                    task.completed ? "line-through opacity-70" : ""
                  }`}
                >
                  {task.title}
                </p>
              )}

              <div className="flex gap-2 mt-2 text-xs">
                <span
                  className={`px-2 py-1 rounded text-white ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority || "low"}
                </span>

                <span className="bg-gray-300 px-2 py-1 rounded">
                  🍅 {task.pomodoros || 1}
                </span>
              </div>

              <div className="w-full bg-gray-300 rounded h-2 mt-3">
                <div
                  className="bg-blue-500 h-2 rounded transition-all"
                  style={{
                    width: `${task.completed ? 100 : 30}%`,
                  }}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() => toggleTask(task)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                ✔
              </button>

              <button
                onClick={() => {
                  setEditId(task._id || null);
                  setEditText(task.title);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                ✏️
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                ✖
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Task;