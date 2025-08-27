import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.log(
        "FETCH_ERROR",
        (error instanceof Error && error.message) || error
      );
    }
  };

  console.log("Data = ", data);

  return (
    <div>
      <header>Vite + React</header>
      <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
  );
}

export default App;
