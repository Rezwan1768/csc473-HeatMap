import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Heatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import "./Heatmap.css";

const HeatmapComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "../data/ridership.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const filteredData = result.data
          .filter((row) => {
            const year = new Date(row.Date).getFullYear();
            return year === 2024;
          })
          .map((row) => ({
            date: row.Date,
            ridership: parseInt(row["Subways: Total Estimated Ridership"], 10),
          }));

        setData(filteredData);
      },
    });
  }, []);

  const getClassForValue = (value) => {
    if (!value || value.ridership === 0) return "color-empty";
    if (value.ridership < 1500000) return "color-scale-1";
    if (value.ridership < 2000000) return "color-scale-2";
    if (value.ridership < 3000000) return "color-scale-3";
    if (value.ridership < 3500000) return "color-scale-4";
    return "color-scale-5";
  };

  const months = [
    "2024-01",
    "2024-02",
    "2024-03",
    "2024-04",
    "2024-05",
    "2024-06",
    "2024-07",
    "2024-08",
    "2024-09",
    "2024-10",
    "2024-11",
  ];

  return (
    <div className="heatmap-container">
      <h1>Subway Ridership Heatmap (2024)</h1>
      <div className="heatmap-grid">
        {months.map((month) => {
          const [year, monthNumber] = month.split("-");
          const startDate = new Date(year, parseInt(monthNumber) - 1, 1);
          const endDate = new Date(year, parseInt(monthNumber), 0);

          return (
            <div key={month} className="month-heatmap">
              <h2>
                {startDate.toLocaleString("default", { month: "long" })} {startDate.getFullYear()}
              </h2>
              <Heatmap
                startDate={startDate}
                endDate={endDate}
                values={data.map((d) => ({
                  date: d.date,
                  ridership: d.ridership,
                }))}
                classForValue={getClassForValue}
                tooltipDataAttrs={(value) => {
                  if (!value || !value.date) return null;
                  const date = new Date(value.date);
                  return {
                    "data-tooltip-id": "heatmap-tooltip",
                    "data-tooltip-content": `
                      Date: ${date.toLocaleString("default", { year: "numeric", month: "long", day: "numeric" })},
                      Ridership: ${value.ridership.toLocaleString()}`,
                  };
                }}
              />
            </div>
          );
        })}
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

export default HeatmapComponent;
