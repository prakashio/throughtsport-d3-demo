import "./App.css";
import { Route, Routes } from "react-router-dom";
import LiveQueryVisualization from "./components/LiveQueryVisualization";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <h1>ThoughtSpot + Custom D3 Graphs</h1>
      <Routes>
        <Route path="" element={<LiveQueryVisualization />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
export default App;
