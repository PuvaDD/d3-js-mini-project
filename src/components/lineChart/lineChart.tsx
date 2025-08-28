import * as d3 from "d3";
import { useRef, useEffect, useCallback } from "react";
import "./lineChart.css";

type Timestamp = number;
type SingleSeriesPoint = [Timestamp, number];
type MultiSeriesPoint = [Timestamp, number[]];

type MappedFeature = { timestamp: number; value: number };

export type ChartData =
  | { title: string; data: SingleSeriesPoint[] }
  | { title: string; data: MultiSeriesPoint[] };

type LineChartProps = {
  chart: ChartData;
  width?: number;
  height?: number;
};

const LineChart = ({ chart, width = 1920, height = 400 }: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const margin = { top: 50, right: 50, bottom: 50, left: 70 };

  const drawChart = useCallback(
    (
      xScale: d3.ScaleLinear<number, number>,
      yScale: d3.ScaleLinear<number, number>
    ) => {
      if (!canvasRef.current || !svgRef.current) return;

      const ctx = canvasRef.current.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);

      const displayData = chart.data;
      const seriesCount = Array.isArray(displayData[0][1])
        ? (displayData[0][1] as number[]).length
        : 1;

      const colors = ["blue", "green", "red"];
      const drawLine = (dataset: MappedFeature[], color: string) => {
        ctx.save();

        // Clip canvas to chart bounds
        ctx.beginPath();
        ctx.rect(
          margin.left,
          margin.top,
          width - margin.left - margin.right,
          height - margin.top - margin.bottom
        );
        ctx.clip();

        ctx.beginPath();
        dataset.forEach((d, i) => {
          const x = xScale(d.timestamp);
          const y = yScale(d.value);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      };

      for (let s = 0; s < seriesCount; s++) {
        const seriesData: MappedFeature[] = displayData
          .map((d) => {
            const y = Array.isArray(d[1]) ? d[1][s] : d[1];
            return { timestamp: d[0], value: y };
          })
          .filter(
            (d) =>
              d.value !== null &&
              d.value !== undefined &&
              !Number.isNaN(d.value)
          );

        drawLine(seriesData, colors[s % colors.length]);
      }

      const svg = d3.select(svgRef.current);
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .select<SVGGElement>(".x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg
        .select<SVGGElement>(".y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);
    },
    [chart, width, height]
  );

  useEffect(() => {
    const displayData = chart.data;

    const xValues = displayData.map((d) => d[0]);
    const yValues: number[] = [];
    displayData.forEach((d) => {
      const y = d[1];
      if (Array.isArray(y)) {
        y.forEach((v) => {
          if (v != null && !Number.isNaN(v)) yValues.push(v);
        });
      } else if (y != null && !Number.isNaN(y)) {
        yValues.push(y);
      }
    });

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(xValues) as [number, number])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(yValues) as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    drawChart(xScale, yScale);

    // Zoom only X
    if (svgRef.current) {
      const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 20])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", (event) => {
          const transform = event.transform;
          const newX = transform.rescaleX(xScale);
          drawChart(newX, yScale);
        });

      svg.call(zoom);
    }

    return () => {
      if (svgRef.current) {
        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
        svg.on(".zoom", null);
      }
    };
  }, [chart, width, height, drawChart]);

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
