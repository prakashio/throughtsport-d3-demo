import "./App.css";
import { Route, Routes } from "react-router-dom";
import LiveQueryVisualization from "./components/LiveQueryVisualization";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <div className="App my-4">
      <header>
        <img
          src="./logo.png"
          alt="stack-overflow"
          className="w-24 bg-cyan-950 h-24 ml-4 rounded-lg shadow-xl"
        />
      </header>
      <Routes>
        <Route path="" element={<LiveQueryVisualization />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
export default App;
