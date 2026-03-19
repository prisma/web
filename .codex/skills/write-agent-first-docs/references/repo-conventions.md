# Repo Conventions

## Scope

- Latest docs live in `apps/docs/content/docs/`.
- Versioned legacy docs live in `apps/docs/content/docs.v6/`.
- New work should target `content/docs` unless the request explicitly mentions v6.

## Frontmatter

- Latest docs pages normally include `title`, `description`, `url`, `metaTitle`, and `metaDescription`.
- Optional fields used in this repo include `image`, `badge`, and `aiPrompt`.
- `badge` only accepts `early-access`, `preview`, or `deprecated`.
- Some layouts use `wide: true` or `full: true`. Generated Management API endpoint pages also include an `_openapi` block.
- The frontmatter `title` functions as the page H1. Most pages start body content at `##`, not `#`.

## Links and slugs

- Internal links are root-relative from the docs base, for example `/orm/...`, `/guides/...`, `/postgres/...`, `/management-api/...`.
- Do not use relative Markdown links like `../foo`.
- Filenames define slugs. Sidebar structure comes from nearby `meta.json` files, so renames and splits usually require `meta.json` updates.
- `meta.json` supports section dividers like `"---Database---"` and folder expansion like `"...database"`.

## MDX and components

- The docs app supports directive admonitions such as `:::info`, `:::warning`, `:::note`, and `:::tip`, with optional bracketed titles like `:::tip[Need a PostgreSQL database?]`.
- Additional callout types are mapped in `apps/docs/source.config.ts`, including `success`, `error`, and `ppg`.
- Prefer directive admonitions for caveats, compatibility notes, and warnings. Do not put core steps only inside a callout.
- Prefer code-fence tabs with `tab="..."` for alternate variants. Manual `<Tabs>` support exists, but fence tabs are the common pattern in content pages.
- Images use root-relative `/img/...` paths and are zoomable in the UI.

## Code fences

- Use an explicit language on every fence.
- For package-manager commands, use `npm` fences so the UI can auto-convert to npm, pnpm, yarn, and bun.
- Common metadata in this repo includes `title="path"`, `tab="..."`, `showLineNumbers`, `highlight=...`, `wrap`, and `no-copy`.
- When a snippet represents a file, prefer `title="..."` with the file path.

## Generated pages

- Management API endpoint pages are generated and usually contain `<APIPage ... />` plus a generated-file comment.
- Do not hand-author that generated shape unless you are intentionally updating the generation pipeline.
