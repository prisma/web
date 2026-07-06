import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';
export function Mermaid({ chart }: { chart: string }) {
  try {
    const svg = renderMermaidSVG(chart, {
      bg: 'var(--color-fd-background)',
      fg: 'var(--color-fd-foreground)',
      // Edge/message labels default to a too-dim bg/fg mix; use the theme's muted-foreground for a softer, legible gray.
      muted: 'var(--color-fd-muted-foreground)',
      transparent: true,
      interactive: false,
    });

    return <div className="w-full h-full overflow-hidden [&>*]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
}