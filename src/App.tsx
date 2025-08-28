import type {
  ChartData,
  MappedFeature,
  PreparedChart,
} from "./utils/lineChartTypes";

import { useEffect, useState } from "react";

import LineChart from "./components/lineChart/lineChart";
import "./App.css";

function App() {
  const [data, setData] = useState<null | PreparedChart[]>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const prepareChart = (chart: ChartData): PreparedChart => {
    const displayData = chart.data;

    // Determine number of series
    const seriesCount = Array.isArray(displayData[0][1])
      ? (displayData[0][1] as number[]).length
      : 1;

    // Build each series
    const series: MappedFeature[][] = Array.from(
      { length: seriesCount },
      (_, s) =>
        displayData
          .map((d) => {
            const y = Array.isArray(d[1]) ? d[1][s] : d[1];
            return { timestamp: d[0], value: y };
          })
          .filter(
            (d) =>
              d.value !== null &&
              d.value !== undefined &&
              !Number.isNaN(d.value)
          )
    );

    return { title: chart.title, series };
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) throw new Error("Failed to fetch data");

      const result: ChartData[] = await response.json();

      const prepared = result.map(prepareChart);

      setData(prepared);
    } catch (error) {
      console.log(
        "FETCH_ERROR",
        (error instanceof Error && error.message) || error
      );
    }
  };

  const renderCharts = () => {
    if (!data?.length) return;

    return data.map((d, i) => (
      <section className="chart-section" key={i}>
        <h1>{d.title}</h1>
        <LineChart chart={d} />
      </section>
    ));
  };

  return (
    <div>
      <header>Vite + React</header>
      {renderCharts()}
    </div>
  );
}

export default App;
