import React, { useEffect, useState } from "react";
import {
  getSearchData,
  tsLogin,
} from "../../utils/thoughtspot-rest-api-v1-helpers";
import MultilineChart from "../MultilineChart/MultilineChart";
import CardWrapper from "../Common/Card/Card";
import "./styles.css";
import NumberAnimation from "../NumberAnimation/NumberAnimation";
import Select from "../Common/Select/Select";

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const TimePeriodTypes = [
  { value: "", label: "Select time period" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "Yearly", label: "Yearly" },
];

// const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca"; // Sample Data
// const worksheetID = "b5ecc064-bfaf-4c31-9612-1927667f492b"; // ACI
const worksheetID = "4de2e208-b3d6-4746-a907-1d1e3a5e60f1"; // Stack overflow

export default function Dashboard() {
  const [graphData, setGraphData] = useState({});
  const [timePeriod, setTimePeriod] = useState("monthly");

  const [analyticsData, setAnalyticsData] = useState({
    commentsCount: 0,
    postsCount: 0,
    usersCount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalyticsData = async () => {
    await tsLogin(tsURL, USER, PASSWORD);
    const totalCommentsCount = await getSearchData(
      tsURL,
      worksheetID,
      "count [comments]"
    );
    setAnalyticsData((value) => ({
      ...value,
      commentsCount: totalCommentsCount.data[0],
    }));

    const totalPostsCount = await getSearchData(
      tsURL,
      worksheetID,
      "count [post]"
    );

    setAnalyticsData((value) => ({
      ...value,
      postsCount: totalPostsCount.data[0],
    }));

    const totalUsersCount = await getSearchData(
      tsURL,
      worksheetID,
      "count [user_name]"
    );

    setAnalyticsData((value) => ({
      ...value,
      usersCount: totalUsersCount.data[0],
    }));
  };

  const fetchGraphData = async (timePeriod) => {
    setIsLoading(true);
    await tsLogin(tsURL, USER, PASSWORD);
    const commentsCount = await getSearchData(
      tsURL,
      worksheetID,
      `count [comments] [CREATION_DATE].${timePeriod}`
    );

    setGraphData((value) => ({
      ...value,
      commentsCount: {
        data: commentsCount.data,
        columnNames: commentsCount.columnNames,
      },
    }));

    const postCounts = await getSearchData(
      tsURL,
      worksheetID,
      `count [post] [CREATION_DATE].${timePeriod}`
    );

    setGraphData((value) => ({
      ...value,
      postCounts: {
        data: postCounts.data,
        columnNames: postCounts.columnNames,
      },
    }));

    const userCounts = await getSearchData(
      tsURL,
      worksheetID,
      `count [user_name] [CREATION_DATE].${timePeriod}`
    );

    setGraphData((value) => ({
      ...value,
      userCounts: {
        data: userCounts.data,
        columnNames: userCounts.columnNames,
      },
    }));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    fetchGraphData(timePeriod);
  }, [timePeriod]);

  return (
    <>
      <div className="dashboard-wrapper p-4">
        <div className="grid grid-cols-3 justify-center gap-4">
          <CardWrapper>
            <span className="text-gray-500">Total Comments</span>
            <p className="text-4xl text-gray-900 font-bold">
              <NumberAnimation
                value={(analyticsData.commentsCount / 1000000).toFixed(2)}
              />
              M
            </p>
          </CardWrapper>
          <CardWrapper>
            <span className="text-gray-500">Total Posts</span>
            <p className="text-4xl text-gray-900 font-bold">
              <NumberAnimation
                value={(analyticsData.postsCount / 1000000).toFixed(2)}
              />
              M
            </p>
          </CardWrapper>
          <CardWrapper>
            <span className="text-gray-500">Total users</span>
            <p className="text-4xl text-gray-900 font-bold">
              <NumberAnimation
                value={(analyticsData.usersCount / 1000000).toFixed(2)}
              />
              M
            </p>
          </CardWrapper>
        </div>
        <div className="my-4">
          <CardWrapper>
            <div className="flex gap-4">
              <div className="filter-group">
                <label
                  htmlFor="timePeriod"
                  className="text-gray-700 text-sm font-medium text-left block"
                >
                  Time Period
                </label>
                <Select
                  options={TimePeriodTypes}
                  value={timePeriod}
                  name="timePeriod"
                  id="timePeriod"
                  onChange={({ target: { value } }) => setTimePeriod(value)}
                />
              </div>
            </div>
            {isLoading && <div className="block">...Loading chart</div>}
          </CardWrapper>
        </div>
        <div className="mt-4 grid grid-cols-3 grid-rows-2 gap-4">
          {graphData.commentsCount?.data.length > 0 && (
            <CardWrapper>
              <MultilineChart
                graphData={graphData.commentsCount}
                graphHeight={250}
                graphWidth={500}
                color="#71397C"
              />
              <p className="text-base font-medium pb-2 text-[#71397C]">
                Monthly Comments
              </p>
            </CardWrapper>
          )}
          {graphData.postCounts?.data.length > 0 && (
            <CardWrapper>
              <MultilineChart
                graphData={graphData.postCounts}
                graphHeight={250}
                graphWidth={500}
                color="#FABC41"
              />
              <p className="text-base font-medium pb-2 text-[#FABC41]">
                Monthly Posts
              </p>
            </CardWrapper>
          )}
          {graphData.userCounts?.data.length > 0 && (
            <CardWrapper>
              <MultilineChart
                graphData={graphData.userCounts}
                graphHeight={250}
                graphWidth={500}
                color="#00BDAA"
              />
              <p className="text-base font-medium pb-2 text-[#00BDAA]">
                Monthly Users
              </p>
            </CardWrapper>
          )}
        </div>
      </div>
    </>
  );
}
