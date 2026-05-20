import { generateFilesOnly } from "fumadocs-openapi";
import matter from "gray-matter";
import { openapi } from "@/lib/openapi";
import { readdir, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import fg from "fast-glob";

const OUTPUT_DIR = "content/docs/management-api/endpoints";

function withDescriptionFirst(data: Record<string, unknown>, description: string) {
  const { title, description: _description, ...rest } = data;

  return {
    ...(title !== undefined ? { title } : {}),
    description,
    ...rest,
  };
}

function stripEmoji(value: string) {
  return value
    .replace(/[\p{Extended_Pictographic}️]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Remove compact single-line redirect entries by source without touching the rest of the file.
// Returns the modified string and the count of lines actually removed.
function removeRedirectLines(raw: string, sources: Set<string>): { result: string; removed: number } {
  let removed = 0;
  for (const source of sources) {
    const pattern = new RegExp(
      `[ \\t]*\\{ "source": "${escapeRegExp(source)}",[^\\n]+\\},?\\n?`,
      "g",
    );
    const next = raw.replace(pattern, "");
    if (next !== raw) removed++;
    raw = next;
  }
  return { result: raw, removed };
}

async function main() {
  const cwd = process.cwd();
  const endpointsDir = resolve(cwd, OUTPUT_DIR);
  const metaJsonPath = join(endpointsDir, "meta.json");
  const vercelJsonPath = resolve(cwd, "vercel.json");

  // Collect all existing MDX files and their URL frontmatter before generating
  console.log("Scanning existing endpoint MDX files...");
  const existingMdxFiles = await fg("**/*.mdx", { cwd: endpointsDir, absolute: true });

  const oldUrlToFile = new Map<string, string>();
  await Promise.all(
    existingMdxFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf-8");
      const { data } = matter(content);
      if (typeof data.url === "string") {
        oldUrlToFile.set(data.url, filePath);
      }
    }),
  );
  console.log(`Found ${oldUrlToFile.size} existing endpoint URLs`);

  // Track new URLs populated during beforeWrite
  const newUrlToRelPath = new Map<string, string>();

  console.log("Generating new endpoint files...");
  const generatedFiles = await generateFilesOnly({
    input: openapi,
    includeDescription: true,
    per: "operation",
    groupBy: "tag",
    name(output, document) {
      if (output.type === "operation") {
        // @ts-ignore
        const operation = document.paths![output.item.path]![output.item.method]!;
        const operationId = operation.operationId || "";
        const cleanName = operationId
          .replace(/V\d+/g, "")
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase();
        return cleanName;
      }
      return output.item.name;
    },
    beforeWrite(files) {
      const operationByFilePath = new Map<
        string,
        {
          path: string;
          method: string;
          title: string;
          description?: string;
        }
      >();

      for (const entries of Object.values(this.generatedEntries)) {
        for (const entry of entries) {
          if (entry.type !== "operation") continue;
          operationByFilePath.set(entry.path, {
            path: entry.item.path,
            method: entry.item.method.toUpperCase(),
            title: entry.info.title,
            description: entry.info.description,
          });
        }
      }

      for (const file of files) {
        const operation = operationByFilePath.get(file.path);
        if (!operation) continue;

        const parsed = matter(file.content);
        const data = parsed.data as Record<string, unknown>;

        let changed = false;

        const openapiData =
          typeof data._openapi === "object" && data._openapi !== null
            ? (data._openapi as Record<string, unknown>)
            : {};

        if (data._openapi !== openapiData) {
          data._openapi = openapiData;
          changed = true;
        }

        if (openapiData.path !== operation.path) {
          openapiData.path = operation.path;
          changed = true;
        }

        if (openapiData.method !== operation.method) {
          openapiData.method = operation.method;
          changed = true;
        }

        const normalizedPath = file.path
          .replace(/\\/g, "/")
          .replace(/\.mdx$/, "")
          .replace(/^management-api\/endpoints\//, "");
        const url = `/management-api/endpoints/${normalizedPath}`;

        // Capture new URL → relative path mapping (always, not just when changed)
        newUrlToRelPath.set(url, file.path.replace(/\\/g, "/"));

        if (data.url !== url) {
          data.url = url;
          changed = true;
        }

        const title =
          typeof data.title === "string" && data.title.trim().length > 0
            ? data.title.trim()
            : operation.title;
        const metaTitle = `${operation.method} ${operation.path} | ${title}`;

        if (data.metaTitle !== metaTitle) {
          data.metaTitle = metaTitle;
          changed = true;
        }

        const description =
          typeof operation.description === "string" && operation.description.trim().length > 0
            ? stripEmoji(operation.description.trim())
            : `${operation.method} ${operation.path}.`;
        const metaDescription = description.startsWith("Management API:")
          ? description
          : `Management API: ${description}`;

        if (data.description !== description) {
          data.description = description;
          changed = true;
        }

        if (data.metaDescription !== metaDescription) {
          data.metaDescription = metaDescription;
          changed = true;
        }

        if (!changed) continue;

        file.content = matter.stringify(parsed.content, withDescriptionFirst(data, description), {
          lineWidth: -1,
        } as Parameters<typeof matter.stringify>[2]);
      }
    },
  });

  // Exclude experimental endpoints from the published docs
  const filteredFiles = generatedFiles.filter(
    (f) => !f.path.replace(/\\/g, "/").startsWith("[experimental]/"),
  );

  // Write generated files to disk
  await Promise.all(
    filteredFiles.map(async (file) => {
      const filePath = join(endpointsDir, file.path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, file.content, "utf-8");
      console.log(`Generated: ${filePath}`);
    }),
  );

  // Detect stale MDX files (existed before but not in the new generated set)
  const newAbsPaths = new Set(
    filteredFiles.map((f) => join(endpointsDir, f.path.replace(/\\/g, "/"))),
  );
  const staleFiles = existingMdxFiles.filter((f) => !newAbsPaths.has(f));

  // Sync vercel.json redirects without reformatting the file
  {
    const removedUrls = [...oldUrlToFile.keys()].filter((url) => !newUrlToRelPath.has(url));
    // Endpoints that were previously redirected but are now live again
    const restoredSources = new Set(
      [...newUrlToRelPath.keys()].map((url) => `/docs${url}`),
    );

    const toAdd = removedUrls.map((url) => {
      const tag = url.split("/")[3];
      const tagStillExists = [...newUrlToRelPath.keys()].some((u) => u.split("/")[3] === tag);
      const destination = tagStillExists
        ? `/docs/management-api/endpoints/${tag}`
        : "/docs/management-api/endpoints";
      return { source: `/docs${url}`, destination };
    });

    let raw = await readFile(vercelJsonPath, "utf-8");

    // Remove redirects for endpoints that are live again (restored) or that we're about to re-add
    const sourcesToRemove = new Set([
      ...toAdd.map((r) => r.source), // de-dupe before re-inserting
      ...[...restoredSources].filter((s) => s.includes("/management-api/endpoints/")),
    ]);
    const { result: cleaned, removed } = removeRedirectLines(raw, sourcesToRemove);
    raw = cleaned;
    if (removed > 0) console.log(`Removed ${removed} stale/restored redirects from vercel.json`);

    // Prepend new entries for removed endpoints, compact single-line format
    if (toAdd.length > 0) {
      const lines = toAdd
        .map((r) => `    { "source": "${r.source}", "destination": "${r.destination}", "permanent": true },`)
        .join("\n");
      raw = raw.replace(/("redirects"\s*:\s*\[)/, `$1\n${lines}`);
      console.log(`Prepended ${toAdd.length} redirects to vercel.json`);
    }

    if (raw !== cleaned || removed > 0) {
      await writeFile(vercelJsonPath, raw, "utf-8");
    }
  }

  // Delete stale MDX files
  if (staleFiles.length > 0) {
    console.log(`Removing ${staleFiles.length} stale MDX files...`);
    await Promise.all(staleFiles.map((f) => rm(f)));
  }

  // Remove empty tag directories left behind by renamed/removed tags
  const dirEntries = await readdir(endpointsDir, { withFileTypes: true });
  await Promise.all(
    dirEntries
      .filter((d) => d.isDirectory())
      .map(async (d) => {
        const dirPath = join(endpointsDir, d.name);
        const files = await readdir(dirPath);
        if (!files.some((f) => f.endsWith(".mdx"))) {
          await rm(dirPath, { recursive: true });
          console.log(`Removed empty directory: ${d.name}`);
        }
      }),
  );

  // Sync endpoints/meta.json: keep existing order, append new dirs alphabetically, [experimental] last
  const afterDirEntries = await readdir(endpointsDir, { withFileTypes: true });
  const currentTagDirs = new Set(
    afterDirEntries.filter((d) => d.isDirectory()).map((d) => d.name),
  );

  const currentMeta = JSON.parse(await readFile(metaJsonPath, "utf-8"));
  const existingPages: string[] = currentMeta.pages ?? [];

  const kept = existingPages.filter((p) => currentTagDirs.has(p) && p !== "[experimental]");
  const added = [...currentTagDirs]
    .filter((d) => !existingPages.includes(d) && d !== "[experimental]")
    .sort();
  const experimental = currentTagDirs.has("[experimental]") ? ["[experimental]"] : [];

  currentMeta.pages = [...kept, ...added, ...experimental];
  await writeFile(metaJsonPath, JSON.stringify(currentMeta, null, 2) + "\n", "utf-8");
  console.log(`Updated meta.json pages: ${currentMeta.pages.join(", ")}`);
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
