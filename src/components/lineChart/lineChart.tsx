import { useRef, useEffect } from "react";
import "./lineChart.css";

// Types for your data
type Timestamp = number;
type SingleSeriesPoint = [Timestamp, number];
type MultiSeriesPoint = [Timestamp, number[]];

export type ChartData =
  | {
      title: string;
      data: SingleSeriesPoint[];
    }
  | {
      title: string;
      data: MultiSeriesPoint[];
    };

type LineChartProps = {
  chart: ChartData;
  width?: number;
  height?: number;
  maxPoints?: number;
};

const LineChart = ({
  chart,
  width = 1920,
  height = 400,
  maxPoints = 1000,
}: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const margin = { top: 50, right: 50, bottom: 50, left: 70 };

  // DRAW CHART LOGIC
  useEffect(() => {
    if (!canvasRef.current || !svgRef.current) return;

    const displayData = chart.data;
    console.log("display Data = ", displayData);

    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);

    // Calculate X and Y values for scales
    const xValues = displayData.map((d) => d[0]);
    const yValues: number[] = [];

    displayData.forEach((d) => {
      const y = d[1];
      if (Array.isArray(y)) {
        y.forEach((v) => {
          if (v !== null && v !== undefined && !Number.isNaN(v))
            yValues.push(v);
        });
      } else if (y !== null && y !== undefined && !Number.isNaN(y)) {
        yValues.push(y);
      }
    });
  }, [chart, width, height, maxPoints]);

  return (
    <div
      className="line-chart-wrapper"
      style={{ width, height, padding: "30px 0" }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="line-chart-common-styles"
      />
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="line-chart-common-styles"
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

export default LineChart;
