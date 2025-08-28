export type MappedFeature = { timestamp: number; value: number };
export type PreparedChart = {
  title: string;
  series: MappedFeature[][];
};

export type Timestamp = number;
export type SingleSeriesPoint = [Timestamp, number];
export type MultiSeriesPoint = [Timestamp, number[]];

export type ChartData =
  | { title: string; data: SingleSeriesPoint[] }
  | { title: string; data: MultiSeriesPoint[] };

export type LineChartProps = {
  chart: PreparedChart;
  width?: number;
  height?: number;
};
