import { Children, isValidElement, type ReactNode } from "react";
import { AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CtaBurst } from "@/components/sections/cta-burst";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { ctaList, heading, joinBlocks, table } from "./blocks";

type ContentProps = { children?: ReactNode; href?: string; [key: string]: unknown };

/** Escape literal prose while preserving Markdown syntax added by the serializer. */
function escapeText(text: string): string {
  return text.replace(/[\\`*_{}[\]<>|#]|(?<=^[ \t]*)[-+]|(?<=^[ \t]*\d{1,9})[.)]/gm, "\\$&");
}

/** Read literal code without applying prose escaping inside backticks. */
function codeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      isValidElement<ContentProps>(child) ? codeText(child.props.children) : String(child),
    )
    .join("");
}

/** Find semantic table rows without evaluating components or browser-only hooks. */
function tableRows(node: ReactNode): ReactNode[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement<ContentProps>(child)) return [];
    return child.type === "tr" ? [child] : tableRows(child.props.children);
  });
}

/** Convert the comparison's existing JSX content tree; never execute client components. */
export function renderComparisonContent(node: ReactNode, path: string): string {
  function render(value: ReactNode): string {
    if (typeof value === "string" || typeof value === "number") return escapeText(String(value));
    if (Array.isArray(value)) return value.map(render).join("");
    if (!isValidElement<ContentProps>(value)) return "";
    const { type, props } = value;
    if (props["aria-hidden"] === true || type === RoleKicker || type === Texture) return "";
    if (type === "pre") return `\n\n\`\`\`\n${codeText(props.children)}\n\`\`\`\n\n`;
    if (type === "code") {
      const text = codeText(props.children);
      const ticks = "`".repeat(
        Math.max(0, ...[...text.matchAll(/`+/g)].map((match) => match[0].length)) + 1,
      );
      return `${ticks}${text}${ticks}`;
    }

    if (type === CtaBurst) {
      const checks = props.checks as readonly { label: string }[];
      return `\n\n${joinBlocks([
        heading(2, render(props.headline as ReactNode)),
        render(props.body as ReactNode),
        checks.map((item) => `- ${escapeText(item.label)}`).join("\n"),
        ctaList([
          props.primaryCta as { label: string; href: string },
          props.secondaryCta as { label: string; href: string },
        ]),
      ])}\n\n`;
    }

    if (type === "table") {
      const rows = tableRows(props.children).map((row) => {
        if (!isValidElement<ContentProps>(row)) return [];
        return Children.toArray(row.props.children).map((cell) =>
          render(isValidElement<ContentProps>(cell) ? cell.props.children : cell)
            .trim()
            .replace(/\s+/g, " "),
        );
      });
      if (rows.length === 0) return "";
      return `\n\n${table(rows[0], rows.slice(1))}\n\n`;
    }

    if (type === "ul" || type === "ol") {
      const items = Children.toArray(props.children).map((child, index) => {
        const text = render(
          isValidElement<ContentProps>(child) ? child.props.children : child,
        ).trim();
        return `${type === "ol" ? `${index + 1}.` : "-"} ${text.replace(/\n/g, "\n   ")}`;
      });
      return `\n\n${items.join("\n")}\n\n`;
    }

    const children = render(props.children);
    if (props.href) {
      const href = props.href.startsWith("#") ? `${path}${props.href}` : props.href;
      return `[${children.trim()}](${href})`;
    }
    if (type === "strong" || type === "b") return `**${children}**`;
    if (type === "em" || type === "i") return `*${children}*`;
    if (type === "br") return "\n";
    if (type === "blockquote") return `\n\n> ${children.trim().replace(/\n/g, "\n> ")}\n\n`;
    if (type === AccordionTrigger) return `\n\n### ${children.trim()}\n\n`;
    if (type === AccordionContent) return `\n\n${children.trim()}\n\n`;
    if (typeof type === "string" && /^h[1-6]$/.test(type)) {
      return `\n\n${"#".repeat(Number(type[1]))} ${children.trim()}\n\n`;
    }
    if (["p", "section", "figure", "figcaption"].includes(type as string)) {
      return `\n\n${children.trim()}\n\n`;
    }
    return children;
  }

  return render(node)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
