import React from "react";
import Timer from "./components/Timer";
import Task from "./components/Task";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Pomodoro App 🍅</h1>

      <Timer />

      <hr />

      <Task />
    </div>
  );
}

export default App;