import type { ReactNode } from "react";
import {
  SCROLL_HINT,
  STICKY,
  TABLE_FRAME,
  TABLE_ROW,
  TABLE_STACK,
  TD,
  TH_COL,
  TH_ROW,
} from "./table-styles";
import { TableScrollRegion } from "./table-scroll-region";

export type CompareTableRow = {
  /** Omit on choose tables: those are competitor | Prisma columns only. */
  label?: string;
  cells: readonly ReactNode[];
};

export type CompareTableProps = {
  /** Id of the section heading that names the table for screen readers. */
  labelledBy: string;
  /** Header over the row labels. Omit with unlabelled choose rows. */
  corner?: string;
  columns: readonly string[];
  rows: readonly CompareTableRow[];
  minWidth: string;
};

/**
 * Feature, database, task, and choose matrices. Below 640px each row stacks as
 * a card with `data-label` on every cell. The Markdown serializer reads these
 * props directly, so it never renders this component.
 */
export function CompareTable({ labelledBy, corner, columns, rows, minWidth }: CompareTableProps) {
  const labelled = Boolean(corner);
  const columnWidth = `${(labelled ? 78 : 100) / columns.length}%`;
  return (
    <TableScrollRegion
      labelledBy={labelledBy}
      className={`${TABLE_FRAME} ${TABLE_STACK}`}
      style={SCROLL_HINT}
    >
      <table
        className="w-full border-collapse text-left"
        style={{ ["--compare-table-min-width" as string]: minWidth }}
      >
        <thead>
          <tr>
            {labelled ? (
              <th scope="col" className={`${TH_COL} ${STICKY}`} style={{ width: "22%" }}>
                {corner}
              </th>
            ) : null}
            {columns.map((column) => (
              <th key={column} scope="col" className={TH_COL} style={{ width: columnWidth }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.label ?? rowIndex} className={TABLE_ROW}>
              {labelled ? (
                <th scope="row" className={`${TH_ROW} ${STICKY}`}>
                  {row.label}
                </th>
              ) : null}
              {row.cells.map((cell, index) => (
                <td key={columns[index]} className={TD} data-label={columns[index]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableScrollRegion>
  );
}
