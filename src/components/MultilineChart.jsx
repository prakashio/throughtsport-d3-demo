import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { tip as d3Tip } from "d3-v6-tip";

const MultilineChart = ({ graphData }) => {
  const chartRef = useRef(null);
  const data = graphData.data;
  const colums = graphData.columnNames;

  // [Placement] [Clicks] [Date]

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => new Date(d[1] * 1000)),
        d3.max(data, (d) => new Date(d[1] * 1000)),
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[2])])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3
      .line()
      .x((d) => xScale(new Date(d[1] * 1000)))
      .y((d) => yScale(d[2]));

    const categories = Array.from(new Set(data.map((d) => d[0])));

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
      .style("text-anchor", "middle")
      .text(colums[1]);

    // Y-axis label
    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", 40)
      .attr("y", 0 - margin.top / 2)
      .style("text-anchor", "middle")
      .text(colums[2]);

    const tip = d3Tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html((d) => `<span>${d[2]}</span>`);

    svg.call(tip);

    categories.forEach((category) => {
      const categoryData = data
        .filter((d) => d[0] === category)
        .sort((a, b) => b[1] - a[1]);

      // Draw the line
      svg
        .append("path")
        .datum(categoryData)
        .attr("fill", "none")
        .attr("stroke", colorScale(category))
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add circle markers
      svg
        .selectAll(`.${category}-marker`)
        .data(categoryData)
        .enter()
        .append("circle")
        .attr("class", `${category}-marker`)
        .attr("cx", (d) => xScale(new Date(d[1] * 1000)))
        .attr("cy", (d) => yScale(d[2]))
        .attr("r", 4)
        .attr("fill", colorScale(category))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    });

    function handleMouseOver(d) {
      const marker = d3.select(this);
      console.log(d);

      // Show tooltip
      tip.show(d, marker.node());

      // Highlight the marker
      marker.attr("r", 6).attr("stroke-width", 2);
    }

    function handleMouseOut(d) {
      const marker = d3.select(this);

      // Hide tooltip
      tip.hide();

      // Remove the marker highlight
      marker.attr("r", 4).attr("stroke-width", 0);
    }
  }, [data]);

  return <div className="graph-container" ref={chartRef}></div>;
};

export default MultilineChart;
