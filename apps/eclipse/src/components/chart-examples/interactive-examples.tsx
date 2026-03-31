"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@prisma/eclipse";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
} from "recharts";

// Basic Bar Chart Example
export function BasicBarChartExample() {
  const chartData = [
    { month: "January", queries: 186 },
    { month: "February", queries: 305 },
    { month: "March", queries: 237 },
    { month: "April", queries: 73 },
    { month: "May", queries: 209 },
    { month: "June", queries: 214 },
  ];

  const chartConfig = {
    queries: {
      label: "Queries",
      color: "#2563eb",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="queries" fill="var(--color-queries)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  );
}

// Line Chart Example
export function LineChartExample() {
  const chartData = [
    { date: "Jan", connections: 186 },
    { date: "Feb", connections: 305 },
    { date: "Mar", connections: 237 },
    { date: "Apr", connections: 273 },
    { date: "May", connections: 209 },
  ];

  const chartConfig = {
    connections: {
      label: "Connections",
      color: "#8b5cf6",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Line
          type="monotone"
          dataKey="connections"
          stroke="var(--color-connections)"
          strokeWidth={2}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  );
}

// Area Chart Example
export function AreaChartExample() {
  const chartData = [
    { month: "Jan", requests: 4000, cached: 2400 },
    { month: "Feb", requests: 3000, cached: 1398 },
    { month: "Mar", requests: 2000, cached: 9800 },
    { month: "Apr", requests: 2780, cached: 3908 },
    { month: "May", requests: 1890, cached: 4800 },
  ];

  const chartConfig = {
    requests: {
      label: "Requests",
      color: "#3b82f6",
    },
    cached: {
      label: "Cached",
      color: "#10b981",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Area
          type="monotone"
          dataKey="requests"
          stackId="1"
          stroke="var(--color-requests)"
          fill="var(--color-requests)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="cached"
          stackId="1"
          stroke="var(--color-cached)"
          fill="var(--color-cached)"
          fillOpacity={0.6}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

// Chart with Legend Example
export function ChartWithLegendExample() {
  const chartData = [
    { month: "Jan", orm: 186, accelerate: 80 },
    { month: "Feb", orm: 305, accelerate: 200 },
    { month: "Mar", orm: 237, accelerate: 120 },
  ];

  const chartConfig = {
    orm: {
      label: "Prisma ORM",
      color: "#2563eb",
    },
    accelerate: {
      label: "Accelerate",
      color: "#8b5cf6",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="orm" fill="var(--color-orm)" radius={4} />
        <Bar dataKey="accelerate" fill="var(--color-accelerate)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}

// Pie Chart Example
export function PieChartExample() {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    chrome: {
      label: "Chrome",
      color: "#2563eb",
    },
    safari: {
      label: "Safari",
      color: "#60a5fa",
    },
    firefox: {
      label: "Firefox",
      color: "#f97316",
    },
    edge: {
      label: "Edge",
      color: "#10b981",
    },
    other: {
      label: "Other",
      color: "#6b7280",
    },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <Pie data={chartData} dataKey="visitors" nameKey="browser" />
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}

// Tooltip Indicator Examples
export function TooltipIndicatorDotExample() {
  const chartData = [
    { month: "Jan", value: 186 },
    { month: "Feb", value: 305 },
    { month: "Mar", value: 237 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#2563eb",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipIndicatorLineExample() {
  const chartData = [
    { month: "Jan", value: 186 },
    { month: "Feb", value: 305 },
    { month: "Mar", value: 237 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#2563eb",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipIndicatorDashedExample() {
  const chartData = [
    { month: "Jan", value: 186 },
    { month: "Feb", value: 305 },
    { month: "Mar", value: 237 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#2563eb",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
      </BarChart>
    </ChartContainer>
  );
}

// Multiple Data Series Example
export function MultipleDataSeriesExample() {
  const chartData = [
    { month: "Jan", series1: 186, series2: 80, series3: 120 },
    { month: "Feb", series1: 305, series2: 200, series3: 150 },
    { month: "Mar", series1: 237, series2: 120, series3: 180 },
    { month: "Apr", series1: 273, series2: 190, series3: 130 },
    { month: "May", series1: 209, series2: 130, series3: 140 },
  ];

  const chartConfig = {
    series1: {
      label: "Series 1",
      color: "#2563eb",
    },
    series2: {
      label: "Series 2",
      color: "#8b5cf6",
    },
    series3: {
      label: "Series 3",
      color: "#10b981",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="series1" fill="var(--color-series1)" radius={4} />
        <Bar dataKey="series2" fill="var(--color-series2)" radius={4} />
        <Bar dataKey="series3" fill="var(--color-series3)" radius={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}

// Stacked Area Chart Example
export function StackedAreaChartExample() {
  const chartData = [
    { date: "Jan", cached: 1200, uncached: 800 },
    { date: "Feb", cached: 1800, uncached: 1200 },
    { date: "Mar", cached: 2200, uncached: 900 },
    { date: "Apr", cached: 2800, uncached: 1100 },
    { date: "May", cached: 3200, uncached: 1300 },
  ];

  const chartConfig = {
    cached: {
      label: "Cached",
      color: "#10b981",
    },
    uncached: {
      label: "Uncached",
      color: "#ef4444",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Area
          type="monotone"
          dataKey="cached"
          stackId="1"
          fill="var(--color-cached)"
          stroke="var(--color-cached)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="uncached"
          stackId="1"
          fill="var(--color-uncached)"
          stroke="var(--color-uncached)"
          fillOpacity={0.6}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

// Custom Styled Chart Example
export function CustomStyledChartExample() {
  const chartData = [
    { month: "Jan", value: 186 },
    { month: "Feb", value: 305 },
    { month: "Mar", value: 237 },
    { month: "Apr", value: 273 },
    { month: "May", value: 209 },
  ];

  const chartConfig = {
    value: {
      label: "Response Time (ms)",
      color: "#8b5cf6",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" />
        <YAxis />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={3}
          dot={{ r: 6 }}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      </LineChart>
    </ChartContainer>
  );
}
