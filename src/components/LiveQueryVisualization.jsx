import React, { useEffect, useState } from "react";
import {
  getSearchData,
  tsLogin,
} from "./utils/thoughtspot-rest-api-v1-helpers";
import MultilineChart from "./MultilineChart";

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

// const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const worksheetID = "b5ecc064-bfaf-4c31-9612-1927667f492b";

export default function LiveQueryVisualization() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const query = form.get("query");
    setQuery(query);
  };

  const [graphData, setGraphData] = useState({
    data: [],
    columnNames: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (query) => {
    if (!query) {
      return;
    }
    setIsLoading(true);
    const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
    const responseSearch = await getSearchData(tsURL, worksheetID, query);

    setIsLoading(false);

    const queryResponseData = await responseSearch;
    setGraphData({
      data: queryResponseData.data,
      columnNames: queryResponseData.columnNames,
    });
  };

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <>
      {isLoading && <div>...Loading chart</div>}
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="query"
            id="query"
            required
            className="query-input"
          />

          <button className="query-submit" type="submit">
            Submit Query
          </button>

          <ul>
            <li>
              <p>[Placement] [Media Spend] [Date]</p>
            </li>
            <li>
              <p>[Placement] [Engagement] [Date]</p>
            </li>
            <li>
              <p>[Placement] [Impressions] [Date]</p>
            </li>
          </ul>
        </form>
      </div>
      <hr />
      {graphData.data.length > 0 && <MultilineChart graphData={graphData} />}
    </>
  );
}
