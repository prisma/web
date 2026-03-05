import defaultMdxComponents from "fumadocs-ui/mdx";

import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import * as icons from "lucide-react";
import {
  CodeBlock,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
  Pre,
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Input,
} from "@prisma/eclipse";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const mdxComponents = {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    // Fumadocs tabs for manual usage (with items prop)
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
    // Eclipse CodeBlock tab components - globally available for code blocks
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    img: (props: any) => <ImageZoom {...(props as any)} />,
    input: (props: any) => <Input {...props} />,
  };

  return {
    ...mdxComponents,
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
  };
}
