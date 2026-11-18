import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const BRUNO_CLI = "@usebruno/cli@4.3.0";
const COLLECTION_NAME = "Prisma REST API";
const EXPERIMENTAL_TAG = "[Experimental]";
const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];

type Operation = { tags?: string[] };
type PathItem = Record<string, unknown>;
type OpenApiSpec = {
  paths?: Record<string, PathItem>;
  tags?: { name?: string }[];
};

// Drop experimental operations so the collection matches the documented API,
// the same way the Postman collection omits the "[Experimental]" folder.
function removeExperimentalOperations(spec: OpenApiSpec): OpenApiSpec {
  const paths: Record<string, PathItem> = {};

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const kept: PathItem = {};
    for (const [key, value] of Object.entries(pathItem)) {
      const isExperimental =
        HTTP_METHODS.includes(key) && ((value as Operation).tags ?? []).includes(EXPERIMENTAL_TAG);
      if (!isExperimental) kept[key] = value;
    }

    if (HTTP_METHODS.some((method) => method in kept)) {
      paths[path] = kept;
    }
  }

  return {
    ...spec,
    paths,
    tags: spec.tags?.filter((tag) => tag.name !== EXPERIMENTAL_TAG),
  };
}

async function main() {
  const cwd = process.cwd();

  const cachePath = join(cwd, "cache/openapi.json");
  let spec: OpenApiSpec;
  try {
    spec = JSON.parse(await readFile(cachePath, "utf-8"));
  } catch {
    console.error("Failed to read cache/openapi.json — run `pnpm fetch-openapi` first");
    process.exit(1);
  }

  const outputPath = join(cwd, "public/bruno/prisma-rest-api");
  const tempDir = await mkdtemp(join(tmpdir(), "prisma-bruno-"));

  try {
    const specPath = join(tempDir, "openapi.json");
    await writeFile(specPath, JSON.stringify(removeExperimentalOperations(spec)), "utf-8");

    console.log("Converting OpenAPI spec to a Bruno collection...");

    // The collection is one file per request. Regenerate it from scratch so
    // requests removed from the spec don't linger.
    await rm(outputPath, { recursive: true, force: true });

    // `bru import` writes the OpenCollection YAML layout by default and picks up
    // the OAuth2 security scheme from the spec. The Bruno CLI is only needed when
    // the collection is regenerated, so run a pinned version instead of installing it.
    await execFileAsync("npx", [
      "--yes",
      BRUNO_CLI,
      "import",
      "openapi",
      "--source",
      specPath,
      "--output",
      outputPath,
      "--collection-name",
      COLLECTION_NAME,
    ]);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  console.log(`Generated Bruno collection: ${outputPath}`);
}

main().catch((err) => {
  console.error("Failed to generate Bruno collection:", err);
  process.exit(1);
});
