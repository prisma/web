"use client";
import { useState } from "react";
import { Button, Card, Badge } from "@prisma/eclipse";
import ecosystem from "../../data/ecosystem.json";
import { cn } from "@/lib/cn";

import GitHubButton from "react-github-btn";
export const EcosystemGrid = () => {
  const filters = ["generator", "middleware", "other", "show-all"];
  const [activeFilter, setActiveFilter] = useState("show-all");
  return (
    <>
      <div className="flex gap-4 items-center justify-start mx-auto flex-col md:flex-row">
        <div className="text-foreground-neutral font-black text-lg uppercase font-sans-display">
          Filter by:
        </div>
        <div className="flex gap-4 items-center justify-start ">
          {filters.map((filter) => (
            <Button
              variant={
                activeFilter === filter ? "orm-reverse" : "default-stronger"
              }
              size="lg"
              className="capitalize"
              onClick={() => setActiveFilter(filter)}
              key={filter}
            >
              <span>{filter.replace("-", " ")}</span>
            </Button>
          ))}
        </div>
      </div>
      <div>
        {filters.slice(0, -1).map((filter) => (
          <div
            className={cn(
              "flex flex-col gap-12 my-12",
              activeFilter !== filter &&
                activeFilter !== "show-all" &&
                "hidden",
            )}
          >
            <h3 className="text-foreground-neutral font-sans-display text-3xl stretch-display my-0 font-bold capitalize">
              {filter.replace("-", " ")}
            </h3>
            <div className="grid lg:grid-cols-3! md:grid-cols-2 gap-4">
              {ecosystem.list
                .filter((box) => box.type === filter)
                .map((box) => (
                  <a
                    href={box.npmUrl}
                    target="_blank"
                    className="contents"
                    rel="noopener noreferrer"
                    key={box.name}
                  >
                    <Card className="grid grid-rows-[auto_1fr_auto]">
                      <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display my-0 font-bold line-clamp-2 hover:line-clamp-none">
                        {box.name}
                      </h3>
                      <p className="text-foreground-neutral font-sans-display text-sm line-clamp-3">
                        {box.description}
                      </p>
                      <div className="flex gap-2 justify-between items-center">
                        <Badge
                          className="w-fit"
                          color="orm"
                          size="lg"
                          label={box.type}
                        ></Badge>

                        <div className="relative after:content-[''] after:absolute after:w-full after:h-full after:z-[10000] after:left-0 after:top-0">
                          <GitHubButton
                            href={`https://github.com/${box.githubRepo}`}
                            data-color-scheme="no-preference: light; light: light; dark: dark;"
                            data-icon="octicon-star"
                            data-show-count="true"
                            aria-label="Star prisma/prisma on GitHub"
                          />
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
