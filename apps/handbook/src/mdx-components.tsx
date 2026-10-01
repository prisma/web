import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@prisma/eclipse";
import { Callout, type CalloutType } from "@/components/handbook/callout";
import { Aside } from "@/components/handbook/aside";
import { Playbook, Step } from "@/components/handbook/playbook";
import { Check, Checklist } from "@/components/handbook/checklist";
import { withHandbookBasePath } from "@/lib/url";

function withBasePathForImageSrc(src: unknown): unknown {
  if (typeof src !== "string") return src;
  if (!src.startsWith("/") || src.startsWith("/_next/")) return src;
  return withHandbookBasePath(src);
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    // Handbook components. See AUTHORING.md for when to use which.
    Callout,
    Aside,
    Playbook,
    Step,
    Checklist,
    Check,
    ...components,
    img: (props: any) => <ImageZoom {...props} src={withBasePathForImageSrc(props.src)} />,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    table: ({ ref: _ref, ...props }) => <Table {...props} />,
    thead: ({ ref: _ref, ...props }) => <TableHeader {...props} />,
    tbody: ({ ref: _ref, ...props }) => <TableBody {...props} />,
    tfoot: ({ ref: _ref, ...props }) => <TableFooter {...props} />,
    tr: ({ ref: _ref, ...props }) => <TableRow {...props} />,
    th: ({ ref: _ref, ...props }) => <TableHead {...props} />,
    td: ({ ref: _ref, ...props }) => <TableCell {...props} />,
    caption: ({ ref: _ref, ...props }) => <TableCaption {...props} />,
    // `:::note` / `:::tip` / `:::warning` / `:::example` directives land here.
    CalloutContainer: ({ type, children }: { type?: string; children: React.ReactNode }) => (
      <Callout type={(type as CalloutType) ?? "note"}>{children}</Callout>
    ),
    CalloutTitle: ({ children }: { children: React.ReactNode }) => (
      <p className="mt-0! mb-1! font-medium">{children}</p>
    ),
    CalloutDescription: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
}
