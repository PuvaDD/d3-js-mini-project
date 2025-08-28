import type { LineChartProps, MappedFeature } from "../../utils/lineChartTypes";

import { useRef, useEffect, useMemo } from "react";

import * as d3 from "d3";
import "./lineChart.css";

const margin = { top: 50, right: 50, bottom: 50, left: 70 };
const colors = ["blue", "green", "red"];

const FAULTY_DATA_FALLBACK_UI = <div>Data is faulty</div>;

const LineChart = ({ chart, width = 1920, height = 400 }: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const validSeries: MappedFeature[][] = useMemo(() => {
    return chart.series.map((s, i) => {
      if (!Array.isArray(s)) {
        console.warn(`Series ${i} is not an array and will be skipped`);
        return [];
      }

      return s.filter((p, j) => {
        if (
          !p ||
          typeof p.timestamp !== "number" ||
          !Number.isFinite(p.timestamp) ||
          typeof p.value !== "number" ||
          !Number.isFinite(p.value)
        ) {
          console.warn(`Invalid point at series ${i}, index ${j}`, p);
          return false;
        }
        return true;
      });
    });
  }, [chart]);

  useEffect(() => {
    if (!canvasRef.current || !svgRef.current) return;

    // Validate Series
    const nonEmptySeries = validSeries.filter((s) => s.length > 0);
    if (nonEmptySeries.length <= 0) return;

    // Access canvas context
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);

    // Compute X and Y extents from series
    const allTimestamps = validSeries.flatMap((s) => s.map((d) => d.timestamp));
    const allValues = validSeries.flatMap((s) => s.map((d) => d.value));

    // Define scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(allTimestamps) as [number, number])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(allValues) as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    validSeries.forEach((s, idx) =>
      drawLine(s, ctx, xScale, yScale, colors[idx % colors.length])
    );

    // Draw axes with SVG
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

    // Zoom only X axis
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

        ctx.clearRect(0, 0, width, height);
        validSeries.forEach((s, idx) => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            margin.left,
            margin.top,
            width - margin.left - margin.right,
            height - margin.top - margin.bottom
          );
          ctx.clip();

          ctx.beginPath();
          s.forEach((d, i) => {
            const x = newX(d.timestamp);
            const y = yScale(d.value);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });

          ctx.strokeStyle = colors[idx % colors.length];
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        });

        svg.select<SVGGElement>(".x-axis").call(d3.axisBottom(newX));
      });

    svg.call(zoom as any);

    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }
    };
  }, [chart, width, height]);

  const drawLine = (
    seriesData: MappedFeature[],
    ctx: CanvasRenderingContext2D,
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    color: string
  ) => {
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
    seriesData.forEach((d, i) => {
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

  if (!chart) {
    console.error("LineChart: chart prop is missing");
    return FAULTY_DATA_FALLBACK_UI;
  }

  if (!Array.isArray(validSeries) || validSeries.length === 0) {
    console.warn("LineChart: chart.series is empty or not an array");
    return FAULTY_DATA_FALLBACK_UI;
  }

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
