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

export default function Dashboard() {
  const [graphData, setGraphData] = useState({
    dashboard: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
    const monthlySpends = await getSearchData(
      tsURL,
      worksheetID,
      "[Placement] [Media Spend] [Date].weekly"
    );
    const impressions = await getSearchData(
      tsURL,
      worksheetID,
      "[Placement] [Impressions] [Date].weekly"
    );
    const engagements = await getSearchData(
      tsURL,
      worksheetID,
      "[Placement] [Engagement] [Date].weekly"
    );

    setIsLoading(false);

    setGraphData({
      engagements: {
        data: engagements.data,
        columnNames: engagements.columnNames,
      },
      impressions: {
        data: impressions.data,
        columnNames: impressions.columnNames,
      },
      monthlySpends: {
        data: monthlySpends.data,
        columnNames: monthlySpends.columnNames,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading && <div>...Loading chart</div>}
      <div>
        {graphData.monthlySpends?.data.length > 0 && (
          <MultilineChart graphData={graphData.monthlySpends} />
        )}
        {graphData.engagements?.data.length > 0 && (
          <MultilineChart graphData={graphData.engagements} />
        )}
        {graphData.impressions?.data.length > 0 && (
          <MultilineChart graphData={graphData.impressions} />
        )}
      </div>
    </>
  );
}
