import React from "react";
import Timer from "../components/Timer";

interface Props {
  onClose: () => void;
}

const FocusMode: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center px-4">

      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl hover:scale-110 transition"
      >
        ✖
      </button>

      {/* 🔥 Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
        🔥 Focus Mode
      </h1>

      {/* ⏱️ Timer */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-red p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <Timer />
      </div>

      {/* 💡 Tip */}
      <p className="text-gray-300 text-sm mt-6 text-center max-w-md">
        Stay focused. Avoid distractions. Complete one task at a time.
      </p>
    </div>
  );
};

export default FocusMode;