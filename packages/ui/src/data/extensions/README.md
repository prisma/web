# Prisma ORM extension registry

Everything that plugs into Prisma ORM is an extension: database packages, column types and query operations, indexes, and middleware. This folder is the single source of truth for the extension directory at
[prisma.io/extensions](https://www.prisma.io/extensions) and the catalog table in
the [Prisma ORM extensions docs](https://www.prisma.io/docs/orm/extensions).

- `official.json`: packages maintained by Prisma.
- `community.json`: packages maintained by the community. This is the file the
  submission form at [prisma.io/extensions/submit](https://www.prisma.io/extensions/submit)
  appends to when it opens a pull request.

Both files are validated when the site or docs build, so a malformed entry fails
the build instead of shipping. The validation lives in `../extensions.ts`.

## Entry shape

```json
{
  "slug": "pgvector",
  "name": "pgvector",
  "package": "@prisma/orm-extension-pgvector",
  "source": "official",
  "status": "release-candidate",
  "tldr": "Vector columns and similarity search for embeddings.",
  "description": "One short paragraph. Inline `code` is fine.",
  "databases": ["postgresql"],
  "tags": ["vector search", "embeddings"],
  "repo": "https://github.com/prisma/orm/tree/main/packages/3-extensions/pgvector",
  "docs": "https://www.prisma.io/docs/orm/extensions/using-extensions",
  "example": "https://github.com/prisma/orm/tree/main/examples/prisma-8-demo",
  "author": { "name": "Prisma", "url": "https://github.com/prisma" },
  "addedAt": "2026-09-09"
}
```

| Field         | Required | Notes                                                                            |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| `slug`        | yes      | URL segment. Lowercase letters, digits, dashes. Unique across both files.        |
| `name`        | yes      | Display name.                                                                    |
| `package`     | yes      | npm package name. Must be published.                                             |
| `source`      | yes      | `official` or `community`.                                                       |
| `status`      | yes      | `stable`, `release-candidate`, or `experimental`.                                |
| `tldr`        | yes      | One sentence, max 140 characters. Shown on cards and in the docs table.          |
| `description` | yes      | One paragraph, max 600 characters. Shown on the detail page.                     |
| `databases`   | yes      | Lowercase slugs the extension works with (`postgresql`, `mongodb`, ...). An extension that adds a database names the database it adds. |
| `tags`        | yes      | Up to 8 lowercase keywords. `middleware` and `database` place the entry in the matching docs tables. |
| `repo`        | yes      | https URL of the source repository.                                              |
| `docs`        | no       | https URL of the documentation.                                                  |
| `example`     | no       | https URL of a runnable example.                                                 |
| `author`      | yes      | `{ name, url }`.                                                                 |
| `addedAt`     | yes      | ISO date the entry was added.                                                    |

## Submitting an extension

Use the form at [prisma.io/extensions/submit](https://www.prisma.io/extensions/submit).
It validates the entry, checks that the package exists on npm, and opens a pull
request against this repository that appends the entry to `community.json`.

To submit by hand, add an entry to `community.json` and open a pull request. Run
`pnpm --filter docs run generate:extensions-catalog` to refresh the docs table.
