"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@prisma/eclipse";
import React from "react";
import { BOARD_ID } from "../constants";

const OpenRolesMenu = ({ setFilter, filters }: any) => {
  return (
    <div className="relative shrink-0 z-1 max-w-full w-full md:max-w-[380px]">
      <p className="mb-3 no-underline stretch-display text-foreground-orm-strong font-sans-display">
        We&apos;re hiring
      </p>
      <h2 className="text-foreground-neutral mb-8 text-4xl font-black font-sans-display stretch-display">
        Open roles
      </h2>
      <p className="text-foreground-neutral-weak text-lg leading-[140%] mb-2">
        Filter by department
      </p>
      <Select defaultValue="All" onValueChange={setFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            {filters.map((dept: string) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const groupBy = (items: any[], key: any) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  );

export const OpenRoles = () => {
  const [filter, setFilter] = React.useState("All");
  const [jobs, setJobs]: any = React.useState({});

  async function fetchJobs() {
    try {
      const rdata = await fetch(
        `https://api.rippling.com/platform/api/ats/v1/board/${BOARD_ID}/jobs`,
      ).then((res) => res.json());
      const rjobsWithDept = rdata
        .map((job: any) => {
          job.dept = job.department.label;
          return job;
        })
        .sort((a: any, b: any) => {
          const aIsGeneral = a.name.includes("General Applications");
          const bIsGeneral = b.name.includes("General Applications");

          if (aIsGeneral && !bIsGeneral) return 1;
          if (!aIsGeneral && bIsGeneral) return -1;
          return a.name.localeCompare(b.name);
        });

      const sameUrls = groupBy(rjobsWithDept, "url");

      const sameUrl = Object.keys(sameUrls);
      const rjobsWithDeptSet = sameUrl.map((e: any) => sameUrls[e][0]);

      const rjobsData = groupBy(rjobsWithDeptSet, "dept");

      setJobs(rjobsData);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs({});
    }
  }

  React.useEffect(() => {
    fetchJobs();
  }, []);
  return (
    <>
      <OpenRolesMenu setFilter={setFilter} filters={Object.keys(jobs)} />
      <div className="w-full flex flex-col gap-15">
        {Object.keys(jobs).length &&
          (filter === "All" ? Object.keys(jobs) : [filter]).map(
            (d: any, idx: number) => (
              <div className="mb-[-10px]" key={idx}>
                <span className="z-1 mb-2.5 px-4 items-center stretch-display text-foreground-orm-strong relative rounded-full inline-flex font-bold text-base h-8 uppercase font-sans-display">
                  {d}
                </span>
                {jobs[d].map((job: any, jobIdx: number) => (
                  <div
                    key={job.id || job.url || `${d}-${jobIdx}`}
                    className="shadow-[0px_0px_46px_rgba(23,43,77,0.01),0px_4px_26px_rgba(23,43,77,0.05),0px_18px_42px_rgba(23,43,77,0.08)] rounded-lg bg-background-default relative z-1 p-5 md:px-6 gap-5 flex mb-2.5 justify-between flex-col items-start lg:items-center lg:flex-row border border-stroke-neutral"
                  >
                    <div className="text-left w-full md:w-auto">
                      <span className="text-base leading-[140%] text-foreground-neutral-weak mb-1 block">
                        {job &&
                          job.workLocation &&
                          job.workLocation.label.split(" (")[0]}
                      </span>
                      <p className="text-foreground-neutral font-bold text-lg leading-[140%] m-0">
                        {job.name}
                      </p>
                    </div>
                    <Button asChild variant="orm" size="2xl" className="w-full md:w-auto shrink-0">
                      <a href={job.url}>
                        View job listing
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ),
          )}
      </div>
    </>
  );
};
