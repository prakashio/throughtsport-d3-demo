import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { tip as d3Tip } from "d3-v6-tip";
import "./styles.css";

const MultilineChart = ({
  graphData,
  graphWidth = 800,
  graphHeight = 400,
  color = "#F85F73",
}) => {
  const chartRef = useRef(null);
  const data = graphData.data.filter((d) => d[0] && d[1]);
  const columns = graphData.columnNames;

  // [Placement] [Clicks] [Date]

  useEffect(() => {
    const margin = { top: 10, right: 10, bottom: 20, left: 60 };
    const width = graphWidth - margin.left - margin.right;
    const height = graphHeight - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => new Date(d[0] * 1000)),
        d3.max(data, (d) => new Date(d[0] * 1000)),
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => xScale(new Date(d[0] * 1000)))
      .y((d) => yScale(d[1]));

    chartRef.current.innerHTML = "";

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

    // X-axis label
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle");
    // .text(columns[0]);

    // Y-axis label
    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -height / 2.5)
      .attr("y", -70)
      .style("text-anchor", "middle");
    // .text(columns[1]);

    const tip = d3Tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html((d) => {
        console.log(d.target);
        const node = d.target.__data__;
        return `<div class="graph-tooltip">
          <p class="tooltip-count">Count: ${node[1]}</p>
          <p class="tooltip-date">Date: ${new Date(
            node[0] * 1000
          ).toLocaleDateString()}</p>
        </div>`;
      });

    svg.call(tip);

    svg
      .append("path")
      .datum(data.sort((a, b) => b[0] - a[0]))
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(d[0] * 1000)))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 2)
      .attr("class", "circle")
      .attr("fill", color)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
  }, [data, columns]);

  return <div className="graph-container" ref={chartRef}></div>;
};

export default MultilineChart;
