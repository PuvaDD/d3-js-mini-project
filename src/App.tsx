import type { ChartData } from "./components/lineChart/lineChart";

import { useEffect, useState } from "react";

import LineChart from "./components/lineChart/lineChart";
import "./App.css";

function App() {
  const [data, setData] = useState<null | ChartData[]>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) throw new Error("Failed to fetch data");

      const result: ChartData[] = await response.json();

      setData(result);
    } catch (error) {
      console.log(
        "FETCH_ERROR",
        (error instanceof Error && error.message) || error
      );
    }
  };

  const renderCharts = () => {
    if (!data?.length) return;

    return data.map((d) => (
      <section className="chart-section">
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
