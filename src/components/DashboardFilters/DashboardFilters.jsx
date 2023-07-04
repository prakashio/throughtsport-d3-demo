import React from "react";
import Select from "../Common/Select/Select";
import "./styles.css";
import CardWrapper from "../Common/Card/Card";

const CategoryTypes = [
  { value: "", label: "Select category type" },
  { value: "comments", label: "Comments" },
  { value: "post", label: "Posts" },
];

const TimePeriodTypes = [
  { value: "", label: "Select time period" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "Yearly", label: "Yearly" },
];

const DashboardFilters = ({ setFilters }) => {
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <section className="filter">
      <CardWrapper className="filter__wrapper">
        <div className="filter__input-group">
          <label htmlFor="category">Category</label>
          <Select
            options={CategoryTypes}
            name="category"
            id="category"
            onChange={({ target: { value } }) =>
              handleFilterChange("category", value)
            }
          />
        </div>
        <div className="filter__input-group">
          <label htmlFor="timePeriod">Time Period</label>
          <Select
            options={TimePeriodTypes}
            name="timePeriod"
            id="timePeriod"
            onChange={({ target: { value } }) =>
              handleFilterChange("timePeriod", value)
            }
          />
        </div>
      </CardWrapper>
    </section>
  );
};

export default DashboardFilters;
