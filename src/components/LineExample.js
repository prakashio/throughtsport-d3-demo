import React, { useEffect, useRef, useState } from "react";
import {
  getSearchData,
  tsLogin,
} from "./utils/thoughtspot-rest-api-v1-helpers";
import { LineChart } from "./utils/d3-helpers";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";

export default function LineExample({ query }) {
  const svg = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (query) => {
    if (!query) {
      return;
    }
    setIsLoading(true);
    const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
    const responseSearch = await getSearchData(tsURL, worksheetID, query);

    setIsLoading(false);

    const newData = await responseSearch.data;

    const formattedData = [];
    newData.forEach(function (item, index) {
      var chartRow = {
        name: item[0],
        value: item[1] / 1000000,
      };
      formattedData[index] = chartRow;
    });

    formattedData["columns"] = ["name", "value"];

    const chart = LineChart(formattedData, {
      x: (d) => d.name,
      y: (d) => d.value,
      xDomain: d3.groupSort(
        formattedData,
        ([d]) => -d.value,
        (d) => d.name
      ), // sort by descending value
      yFormat: ",.3n",
      yLabel: "↑ Sales (Million USD)",
      width: 800,
      height: 500,
      color: "rgb(251, 165, 95)",
      unit: "M",
    });

    //svg is a mutable ref object whose .current property is initialized to the passed argument (initialValue).
    //See. https://reactjs.org/docs/hooks-reference.html#useref
    if (svg.current && chart !== undefined) {
      const previousChart = svg.current.querySelector("#chart");
      if (previousChart) {
        svg.current.replaceChild(chart, previousChart);
      } else {
        svg.current.append(chart);
      }
    }
  };

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <>
      {isLoading && <div>...Loading chart</div>}
      <div ref={svg} />
    </>
  );
}
