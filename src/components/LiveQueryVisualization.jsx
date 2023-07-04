import React, { useEffect, useState } from "react";
import {
  getSearchData,
  tsLogin,
} from "../utils/thoughtspot-rest-api-v1-helpers";
import MultilineChart from "./MultilineChart/MultilineChart";
import DashboardFilters from "./DashboardFilters/DashboardFilters";
import CardWrapper from "./Common/Card/Card";

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

// const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca"; // Sample Data
// const worksheetID = "b5ecc064-bfaf-4c31-9612-1927667f492b"; // ACI
const worksheetID = "4de2e208-b3d6-4746-a907-1d1e3a5e60f1"; // Stack overflow

export default function LiveQueryVisualization() {
  const [filters, setFilters] = useState({
    category: null,
  });

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

  const createQuery = (filters) => {
    if (filters.category && filters.timePeriod) {
      return `count [${filters.category}] [CREATION_DATE].${filters.timePeriod}`;
    }

    return null;
  };

  useEffect(() => {
    const query = createQuery(filters);

    if (query) {
      fetchData(query);
    }
  }, [filters]);

  return (
    <>
      <DashboardFilters setFilters={setFilters} />
      {isLoading && <div>...Loading chart</div>}
      {graphData.data.length > 0 && (
        <CardWrapper>
          <MultilineChart graphData={graphData} />
        </CardWrapper>
      )}
    </>
  );
}
