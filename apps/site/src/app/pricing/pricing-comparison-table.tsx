"use client";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@prisma/eclipse";
import { type ComparisonCell, type Symbol, comparisonSections } from "./pricing-data";

function renderCell(cell: ComparisonCell, currency: Symbol): string {
  if (typeof cell === "string") return cell;
  return cell.text.replace("<price>", cell.price[currency]);
}

export function PricingComparisonTable({ currency }: { currency: Symbol }) {
  return (
    <div className="max-w-[996px] mx-auto mt-10 border border-background-neutral-reverse-weak rounded-xl overflow-x-auto">
      <Table className="table-fixed min-w-[700px]">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="hover:bg-transparent border-b border-background-neutral-reverse bg-background-neutral-weak">
            <TableHead className="bg-background-neutral-weak text-base uppercase tracking-[1.6px] font-sans-display [font-variation-settings:'wght'_800] text-background-neutral-weak">
              {comparisonSections[0]?.title}
            </TableHead>
            {["Free", "Starter", "Pro", "Business"].map((label) => (
              <TableHead
                key={label}
                className="bg-background-neutral-weak text-left text-background-neutral-weak"
              >
                <Badge
                  size="lg"
                  className="rounded-md"
                  color={
                    label === "Pro"
                      ? "ppg"
                      : label === "Starter"
                        ? "orm"
                        : label === "Business"
                          ? "warning"
                          : "neutral"
                  }
                  label={label}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {comparisonSections.map((section) => (
          <TableBody key={section.title}>
            <TableRow className="hover:bg-transparent border-t border-b border-background-neutral-reverse-weak bg-background-neutral-weak">
              <TableCell
                colSpan={5}
                className="bg-background-neutral-weak text-base uppercase tracking-[1.6px] font-sans-display [font-variation-settings:'wght'_800] text-foreground-neutral"
              >
                {section.title}
              </TableCell>
            </TableRow>

            {section.rows.map((row) => {
              const label = typeof row[0] === "string" ? row[0] : row[0].text;
              return (
                <TableRow
                  key={label}
                  className="hover:bg-transparent border-b border-background-neutral-reverse-weak"
                >
                  <TableCell className="font-semibold text-sm text-foreground-neutral">
                    {label}
                  </TableCell>
                  {row.slice(1).map((cell, valueIndex) => (
                    <TableCell
                      key={`${label}-${valueIndex}-${renderCell(cell, currency)}`}
                      className="text-sm text-foreground-neutral-weak"
                    >
                      {renderCell(cell, currency)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        ))}
      </Table>
    </div>
  );
}
