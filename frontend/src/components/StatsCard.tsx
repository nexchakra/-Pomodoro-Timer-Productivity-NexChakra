import React from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const StatsCard: React.FC<Props> = ({ title, value, icon, color }) => {
  return (
    <div
      className={`p-5 rounded-2xl shadow-md bg-white dark:bg-gray-800 flex items-center justify-between transition hover:scale-105`}
    >
      {/* Left */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </h2>
      </div>

      {/* Right Icon */}
      <div
        className={`text-3xl ${
          color ? color : "text-blue-500"
        }`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;