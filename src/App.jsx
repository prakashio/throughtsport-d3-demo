import "./App.css";
import { Route, Routes } from "react-router-dom";
import LineExample from "./components/LineExample";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const query = form.get("query");
    setQuery(query);
  };

  return (
    <div className="App">
      <h1>ThoughtSpot + Custom D3 Graphs</h1>
      <hr />
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="query">Query </label>
          <input type="text" name="query" id="query" required />
          <p>Example query - [sales] [item type]</p>
          <button type="submit">Submit Query</button>
        </form>
      </div>
      <hr />
      <Routes>
        <Route path="" element={<LineExample query={query} />} />
      </Routes>
    </div>
  );
}
export default App;
