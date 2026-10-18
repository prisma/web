import type { ReactNode } from "react";
import { QUIET_NOTE, SCROLL_HINT, STICKY, TABLE_FRAME, TD, TH_COL, TH_ROW } from "./table-styles";

export type PricingColumn = {
  label: string;
  /** Anchor kept on the column header so older links to a product's pricing still land here. */
  id?: string;
};

export type PricingRow = {
  label: string;
  /** One cell per column, in column order. */
  cells: readonly ReactNode[];
};

export type PricingTableProps = {
  /** Id of the section heading that names the table for screen readers. */
  labelledBy: string;
  /** Header over the row labels. */
  corner: string;
  columns: readonly PricingColumn[];
  rows: readonly PricingRow[];
  /** One short line under the table, such as a free tier and a link to the full pricing. */
  note?: ReactNode;
};

/**
 * Cost side by side: one column per product, one row per thing you could pay
 * for. Rows can name paid tiers as well as licenses and hosting. The Markdown
 * serializer reads these props directly, so it never renders this component.
 */
export function ComparisonPricingTable({
  labelledBy,
  corner,
  columns,
  rows,
  note,
}: PricingTableProps) {
  const columnWidth = `${78 / columns.length}%`;
  return (
    <>
      <div
        className={TABLE_FRAME}
        role="region"
        aria-labelledby={labelledBy}
        tabIndex={0}
        style={SCROLL_HINT}
      >
        <table
          className="w-full border-collapse text-left"
          style={{ minWidth: `${12 + 11 * columns.length}rem`, overflow: "visible" }}
        >
          <thead>
            <tr>
              <th scope="col" className={`${TH_COL} ${STICKY}`} style={{ width: "22%" }}>
                {corner}
              </th>
              {columns.map((column) => (
                <th
                  key={column.label}
                  id={column.id}
                  scope="col"
                  className={`${TH_COL} scroll-mt-28`}
                  style={{ width: columnWidth }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-black/[0.06]">
                <th scope="row" className={`${TH_ROW} ${STICKY}`}>
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={columns[index]?.label ?? index} className={TD}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className={QUIET_NOTE}>{note}</p> : null}
    </>
  );
}
