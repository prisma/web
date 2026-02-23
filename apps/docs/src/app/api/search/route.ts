import { createMixedbreadSearchAPI } from 'fumadocs-core/search/mixedbread';
import Mixedbread from '@mixedbread/sdk';
import { SortedResult } from 'fumadocs-core/search';

/** Derive breadcrumbs from URL path segments (e.g. /docs/console/concepts → ['Docs', 'Console']) */
function getBreadcrumbsFromUrl(url: string): string[] {
  const path = url.replace(/#.*$/, '').trim().replace(/\/$/, '') || '/';
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return [];
  // Strip version prefix (e.g. v6)
  const normalized = segments[0] === 'v6' ? segments.slice(1) : segments;
  if (normalized.length === 0) return [];
  // Ancestors only (exclude last = current page), or full path for section roots
  const breadcrumbSegments =
    normalized.length > 1 ? normalized.slice(0, -1) : normalized;
  return breadcrumbSegments.map((s) =>
    s
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  );
}

function slugger(value: string): string {
  if (typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s-]/g, '')
    .replace(/\s+/g, '-');
}

function removeMd(md: string): string {
  if (typeof md !== 'string') return '';
  try {
    return md
      .replace(
        /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/gm,
        '',
      )
      .replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1')
      .replace(/\n={2,}/g, '\n')
      .replace(/^[=\-]{2,}\s*$/gm, '')
      .replace(/~{3}.*\n/g, '')
      .replace(/```[^\n]*\n([\s\S]*?)```/g, (_: string, c: string) => c.trim())
      .replace(/~~/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/gm, '')
      .replace(/!\[(.*?)\][\[\(].*?[\]\)]/g, '')
      .replace(/\[([\s\S]*?)\]\s*[\(\[].*?[\)\]]/g, '$1')
      .replace(/^(\n)?\s{0,3}>\s?/gm, '$1')
      .replace(
        /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
        '$1$3$4$6',
      )
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, '$2$3')
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, '$1$3$4$5')
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      .replace(/`(.+?)`/g, '$1')
      .replace(/~(.*?)~/g, '$1');
  } catch {
    return md;
  }
}

function extractHeadingTitle(text: string): string {
  const t = text.trim();
  return t.startsWith('#') ? removeMd(t.split('\n')[0]?.trim() ?? '') : '';
}

const client = new Mixedbread({ apiKey: process.env.MIXEDBREAD_API_KEY! });

export const { GET } = createMixedbreadSearchAPI({
  client,
  storeIdentifier: 'web-search',
  topK: 20,
  rerank: true,
  transform: (results, _query) => {
    return results.flatMap((item) => {
      const { url = '#', title = 'Untitled' } = item.generated_metadata ?? {};
      
      const formattedUrl = url.startsWith("/docs") ? url.slice(5) : url;
      const base = `${item.file_id}-${item.chunk_index}`;
      const breadcrumbs = getBreadcrumbsFromUrl(formattedUrl);
      const chunkResults: SortedResult[] = [
        { id: `${base}-page`, type: 'page', content: title, url: formattedUrl, breadcrumbs },
      ];
      const heading =
        item.type === 'text' ? extractHeadingTitle(item.text) : '';
      if (heading)
        chunkResults.push({
          id: `${base}-heading`,
          type: 'heading',
          content: heading,
          url: `${formattedUrl}#${slugger(heading)}`,
        });
      return chunkResults;
    });
  },
});
