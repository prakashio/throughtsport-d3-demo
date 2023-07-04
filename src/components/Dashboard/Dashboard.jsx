import React, { useEffect, useState } from "react";
import {
  getSearchData,
  tsLogin,
} from "../../utils/thoughtspot-rest-api-v1-helpers";
import MultilineChart from "../MultilineChart/MultilineChart";
import CardWrapper from "../Common/Card/Card";
import "./styles.css";

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

// const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca"; // Sample Data
// const worksheetID = "b5ecc064-bfaf-4c31-9612-1927667f492b"; // ACI
const worksheetID = "4de2e208-b3d6-4746-a907-1d1e3a5e60f1"; // Stack overflow

export default function Dashboard() {
  const [graphData, setGraphData] = useState({
    dashboard: {},
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    await tsLogin(tsURL, USER, PASSWORD);
    const commentsCount = await getSearchData(
      tsURL,
      worksheetID,
      "count [comments] [CREATION_DATE].weekly"
    );
    const postCounts = await getSearchData(
      tsURL,
      worksheetID,
      "count [post] [CREATION_DATE].weekly"
    );

    setIsLoading(false);

    setGraphData({
      commentsCount: {
        data: commentsCount.data,
        columnNames: commentsCount.columnNames,
      },
      postCounts: {
        data: postCounts.data,
        columnNames: postCounts.columnNames,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="dashboard-wrapper">
        {graphData.commentsCount?.data.length > 0 && (
          <CardWrapper>
            <MultilineChart graphData={graphData.commentsCount} />
          </CardWrapper>
        )}
        {graphData.postCounts?.data.length > 0 && (
          <CardWrapper>
            <MultilineChart graphData={graphData.postCounts} />
          </CardWrapper>
        )}
      </div>
      {isLoading && <div>...Loading chart</div>}
    </>
  );
}
