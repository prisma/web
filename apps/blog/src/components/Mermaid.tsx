import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { useMemo } from 'react';
export async function Mermaid({ chart }: { chart: string }) {
    const { svg, error } = useMemo(() => {
        try {
            return {
                svg: renderMermaidSVG(chart, {
                    bg: 'var(--color-fd-background)',
                    fg: 'var(--color-fd-foreground)',
                    transparent: true,
                    interactive: false,
                }),
                error: null,
            }
        } catch (err) {
            return { svg: null, error: err instanceof Error ? err : new Error(String(err)) }
        }
    }, [chart])

    if (error) {
        return (
            <CodeBlock title="Mermaid">
                <Pre>{chart}</Pre>
            </CodeBlock>
        );
    }
    return <div className="w-full h-full overflow-hidden [&>*]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}