"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@prisma/eclipse";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { CodeBlock, Pre } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { Bar, BarChart } from "recharts";

const Table = ({ children }: { children?: React.ReactNode }) => (
  <div className="">{children ?? null}</div>
);

const TableHeader = ({ children }: { children?: React.ReactNode }) => (
  <div className="">{children ?? null}</div>
);

const TableRow = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-square relative border-none grid grid-cols-[72px_minmax(0,1fr)_80px_48px_72px] gap-6 py-4 px-3",
      className,
    )}
  >
    {children ?? null}
  </div>
);

const TableHead = ({ children }: { children?: React.ReactNode }) => (
  <div className="text-foreground-neutral font-medium font-mona-sans bg-transparent">
    {children}
  </div>
);

const TableCell = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-transparent text-sm">{children ?? null}</div>
);

const TableBody = ({ children }: { children?: React.ReactNode }) => (
  <div className="text-foreground-neutral font-mono">{children ?? null}</div>
);

export const QueryInsightsTable = () => (
  <Table>
    <TableHeader>
      <TableRow className="text-[14px]">
        <TableHead>Latency</TableHead>
        <TableHead />
        <TableHead>Executions</TableHead>
        <TableHead>Reads</TableHead>
        <TableHead>Last seen</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow className="red-table-row">
        <TableCell>15ms</TableCell>
        <TableCell>
          <Pre className="w-full whitespace-normal line-clamp-2 text-ellipsis">
            SELECT p.id, p.title, p.content, p.published, p.authorId,
            p.createdAt, u.id as author_id, u.name, u.email FROM Post p INNER
            JOIN User u ON p.authorId = u.id WHERE p.published = true ORDER BY
            p.createdAt DESC LIMIT 10;
          </Pre>
        </TableCell>
        <TableCell>7</TableCell>
        <TableCell>10</TableCell>
        <TableCell>12:32:31</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>22ms</TableCell>
        <TableCell>
          <CodeBlock
            className="[&>div]:m-0! [&>div]:p-0! [&>div]:bg-transparent! [&_pre>div]:hidden max-w-full border-none [&>div:first-child]:hidden"
            lang="tsx"
          >
            {`post.findMany({ where: { published: true }, include: { author: true }, orderBy: { createdAt: 'desc' }, take: 10 })`}
          </CodeBlock>
        </TableCell>
        <TableCell>18</TableCell>
        <TableCell>13</TableCell>
        <TableCell>12:32:31</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const ContentBox = ({
  children,
  reverse,
  image,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  image?: {
    src: string;
    mobile?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-12 py-12",
        reverse ? "md:flex-row-reverse" : "md:flex-row",
      )}
    >
      <div className="w-full md:min-w-[50%] md:w-[50%] lg:w-120 lg:min-w-120 h-auto flex flex-col justify-center flex-shrink-0">
        {children}
      </div>
      {image && (
        <>
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            className="flex-shrink hidden sm:block min-w-0 max-w-full h-auto object-contain"
          />
          {image.mobile && (
            <Image
              src={image.mobile}
              alt={image.alt ?? ""}
              width={image.width}
              height={image.height}
              className="flex-shrink block sm:hidden min-w-0 max-w-full h-auto object-contain"
            />
          )}
        </>
      )}
    </div>
  );
};

const chartData = [
  { date: "January", connections: 186 },
  { date: "February", connections: 305 },
  { date: "March", connections: 237 },
  { date: "April", connections: 73 },
  { date: "May", connections: 209 },
  { date: "June", connections: 214 },
  { date: "July", connections: 50 },
  { date: "August", connections: 0 },
  { date: "September", connections: 150 },
  { date: "October", connections: 100 },
  { date: "November", connections: 75 },
  { date: "December", connections: 230 },
];

const chartConfig = {
  connections: {
    label: "Connections",
    color: "#8b5cf6",
  },
};

export function QueryInsightsLine() {
  return (
    <ChartContainer config={chartConfig} className="h-25 w-full">
      <LineChart data={chartData} responsive>
        <CartesianGrid vertical={false} opacity={0.2} strokeDasharray="5" />
        <Line
          type="monotone"
          dataKey="connections"
          stroke="var(--color-connections)"
          strokeWidth={2}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          wrapperStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}

const chartDataBars = [
  { month: "January", queries: 186 },
  { month: "February", queries: 305 },
  { month: "March", queries: 237 },
  { month: "April", queries: 73 },
  { month: "May", queries: 209 },
  { month: "June", queries: 214 },
  { month: "July", queries: 50 },
  { month: "August", queries: 0 },
  { month: "September", queries: 150 },
  { month: "October", queries: 100 },
  { month: "November", queries: 75 },
  { month: "December", queries: 230 },
];

const chartConfigBars = {
  queries: {
    label: "Queries",
    color: "#2563eb",
  },
};

export function QueryInsightsBars() {
  return (
    <ChartContainer config={chartConfigBars} className="h-25 w-full">
      <BarChart data={chartDataBars}>
        <CartesianGrid vertical={false} opacity={0.2} strokeDasharray="5" />
        <Bar
          dataKey="queries"
          fill="var(--color-queries)"
          radius={[4, 4, 0, 0]}
          activeBar={false}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: "transparent" }}
          wrapperStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
