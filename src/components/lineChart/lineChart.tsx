import { useRef } from "react";
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
