#!/usr/bin/env node
import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const targets = {
  blog: {
    appDir: "apps/blog",
    filter: "blog",
    basePath: "/blog",
    routes: [
      "/blog",
      "/blog/launching-prisma-compute-public-beta",
      "/blog/prisma-compute-custom-domains",
      "/blog/bringing-prisma-orm-to-react-native-and-expo",
      "/blog/series",
      "/blog/series/prisma-compute",
      "/blog/author/shane-neubauer",
      "/blog/rss.xml",
      "/blog/favicon.ico",
      "/blog/launching-prisma-compute-public-beta/imgs/hero.png",
    ],
  },
  docs: {
    appDir: "apps/docs",
    filter: "docs",
    basePath: "/docs",
    routes: [
      "/docs",
      "/docs/prisma-compute/deploy",
      "/docs/compute/configuration",
      "/docs/orm/prisma-client/setup-and-configuration/introduction",
      "/docs/guides/frameworks/nextjs",
      "/docs/management-api/getting-started",
      "/docs/rss.xml",
      "/docs/og/compute/configuration/image.png",
      "/docs/favicon.ico",
      "/docs/imgs/sidebar-banners/prisma-next.png",
    ],
  },
};

const targetName = process.argv[2];
const target = targets[targetName];

if (!target) {
  console.error(`Usage: node scripts/compute-build-static-app.mjs <${Object.keys(targets).join("|")}>`);
  process.exit(1);
}

const appDir = path.join(repoRoot, target.appDir);
const outputDir = path.join(appDir, ".compute");
const port = String(4400 + Math.floor(Math.random() * 1000));

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
        PRISMA_COMPUTE_DEPLOY: "true",
      },
      stdio: "inherit",
    });

    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with ${signal ?? code}`));
    });
  });
}

function contentTypeForPath(filePath) {
  const ext = path.extname(filePath.split("?")[0]).toLowerCase();
  return (
    {
      ".avif": "image/avif",
      ".css": "text/css; charset=utf-8",
      ".gif": "image/gif",
      ".html": "text/html; charset=utf-8",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".md": "text/markdown; charset=utf-8",
      ".mdx": "text/markdown; charset=utf-8",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".txt": "text/plain; charset=utf-8",
      ".webp": "image/webp",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".xml": "application/xml; charset=utf-8",
    }[ext] ?? "application/octet-stream"
  );
}

function cacheControlForPath(filePath) {
  if (filePath.includes("/_next/static/")) return "public, max-age=31536000, immutable";
  if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(filePath)) return "public, max-age=86400";
  return "public, max-age=300";
}

function normalizePathname(pathname) {
  const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return withoutTrailingSlash || "/";
}

function encodePathname(pathname) {
  return pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function keyForPathname(pathname) {
  const normalized = normalizePathname(pathname);
  const suffix = normalized.slice(target.basePath.length).replace(/^\/+/, "") || "index";
  return `routes/${suffix.replace(/[^a-zA-Z0-9._-]+/g, "_")}`;
}

async function walkMdxFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMdxFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files;
}

function readFrontmatterValue(contents, key) {
  return contents.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1]?.trim();
}

function readFrontmatterList(contents, key) {
  const match = contents.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s*[^\\n]+\\n?)+)`, "m"));
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
    .map((value) => {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        return value.slice(1, -1);
      }

      return value;
    })
    .filter(Boolean);
}

function toBlogAuthorSlug(name) {
  return name
    .replace(/[øØ]/g, "o")
    .replace(/[æÆ]/g, "ae")
    .replace(/[œŒ]/g, "oe")
    .replace(/[ß]/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

async function collectDocsRoutes() {
  if (targetName !== "docs") return [];

  const docsRoot = path.join(appDir, "content/docs");
  const routes = [];
  const routeLimit = Number(process.env.PRISMA_COMPUTE_DOCS_ROUTE_LIMIT ?? "180");

  for (const filePath of await walkMdxFiles(docsRoot)) {
    const contents = await readFile(filePath, "utf8");
    const match = readFrontmatterValue(contents, "url");
    if (!match) continue;

    const frontmatterUrl = match;
    const route = frontmatterUrl.startsWith("/docs")
      ? frontmatterUrl
      : `/docs${frontmatterUrl === "/" ? "" : frontmatterUrl}`;

    // Keep the Compute proof focused on current docs and avoid embedding the
    // historical ORM v6 archive into a single static runtime.
    if (route.startsWith("/docs/orm/v6")) continue;

    routes.push(route);
  }

  const sectionIndexes = new Set([
    "/docs",
    "/docs/accelerate",
    "/docs/ai",
    "/docs/cli",
    "/docs/compute",
    "/docs/console",
    "/docs/guides",
    "/docs/management-api",
    "/docs/orm",
    "/docs/postgres",
    "/docs/query-insights",
    "/docs/studio",
  ]);

  function routePriority(route) {
    if (route === "/docs") return 0;
    if (route.startsWith("/docs/compute")) return 1;
    if (route.startsWith("/docs/prisma-compute")) return 2;
    if (sectionIndexes.has(route)) return 3;
    if (route.startsWith("/docs/prisma-orm/quickstart")) return 4;
    if (route.startsWith("/docs/prisma-orm/add-to-existing-project")) return 5;
    if (route.startsWith("/docs/prisma-postgres")) return 6;
    if (route.startsWith("/docs/postgres")) return 7;
    if (route.startsWith("/docs/guides/frameworks")) return 8;
    if (route.startsWith("/docs/guides/deployment")) return 9;
    if (route.startsWith("/docs/guides/database")) return 10;
    if (route.startsWith("/docs/guides/runtimes")) return 11;
    if (route.startsWith("/docs/orm/prisma-client/setup-and-configuration")) return 12;
    if (route.startsWith("/docs/orm/prisma-client/queries")) return 13;
    if (route.startsWith("/docs/orm/prisma-schema")) return 14;
    if (route.startsWith("/docs/orm/prisma-migrate")) return 15;
    if (route.startsWith("/docs/orm/reference")) return 16;
    if (route.startsWith("/docs/management-api")) return 17;
    if (route.startsWith("/docs/cli")) return 18;
    if (route.startsWith("/docs/ai")) return 19;
    if (route.startsWith("/docs/accelerate")) return 20;
    if (route.startsWith("/docs/console")) return 21;
    if (route.startsWith("/docs/studio")) return 22;
    if (route.startsWith("/docs/orm")) return 23;
    return 24;
  }

  return routes
    .sort((a, b) => routePriority(a) - routePriority(b) || a.localeCompare(b))
    .slice(0, routeLimit)
    .sort();
}

async function collectBlogRoutes() {
  if (targetName !== "blog") return [];

  const blogRoot = path.join(appDir, "content/blog");
  const routeLimit = Number(process.env.PRISMA_COMPUTE_BLOG_ROUTE_LIMIT ?? "20");
  const posts = [];

  for (const filePath of await walkMdxFiles(blogRoot)) {
    if (path.basename(filePath) !== "index.mdx") continue;

    const contents = await readFile(filePath, "utf8");
    const slug = readFrontmatterValue(contents, "slug") ?? path.basename(path.dirname(filePath));
    const date = contents.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];

    if (!date) {
      throw new Error(`Missing date frontmatter in ${path.relative(repoRoot, filePath)}`);
    }

    if (Number(date.slice(0, 4)) < 2024) continue;

    posts.push({
      authors: readFrontmatterList(contents, "authors"),
      date,
      series: readFrontmatterValue(contents, "series"),
      route: `/blog/${slug}`,
    });
  }

  const selectedPosts = posts
    .sort((a, b) => b.date.localeCompare(a.date) || a.route.localeCompare(b.route))
    .slice(0, routeLimit);
  const dependentRoutes = [];

  for (const post of selectedPosts) {
    for (const author of post.authors) {
      const slug = toBlogAuthorSlug(author);
      if (slug) dependentRoutes.push(`/blog/author/${slug}`);
    }

    if (post.series) dependentRoutes.push(`/blog/series/${post.series}`);
  }

  return [...new Set([...selectedPosts.map((post) => post.route), ...dependentRoutes])].sort();
}

async function getTargetRoutes() {
  return [...new Set([...target.routes, ...(await collectDocsRoutes()), ...(await collectBlogRoutes())])];
}

function startStandaloneServer() {
  const serverPath = path.join(appDir, ".next/standalone", target.appDir, "server.js");
  const child = spawn("node", [serverPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_ENV: "production",
      PORT: port,
      PRISMA_COMPUTE_DEPLOY: "true",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  return child;
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;

  child.kill("SIGTERM");
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 3000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function fetchFromStandalone(route) {
  const url = `http://127.0.0.1:${port}${route}`;
  const started = Date.now();
  let lastError;

  while (Date.now() - started < 180_000) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) return response;

      lastError = new Error(`HTTP ${response.status} from ${url}`);
      if (response.status >= 400 && response.status < 500) break;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw lastError ?? new Error(`Timed out fetching ${url}`);
}

async function walkFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function isLikelyAssetPath(pathname) {
  return (
    pathname.includes("/_next/static/") ||
    pathname.includes("/imgs/") ||
    pathname.includes("/authors/") ||
    /\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|webp|woff2?|xml)$/i.test(pathname)
  );
}

function extractLocalAssetPaths(body) {
  const paths = new Set();
  const patterns = [
    /(?:href|src|poster|content)=["']([^"']+)["']/g,
    /(?:href|src|poster|content)\\?&quot;:&quot;([^&]+)&quot;/g,
    /url\(["']?([^"')]+)["']?\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern)) {
      const raw = match[1]?.replaceAll("&amp;", "&");
      if (!raw) continue;

      let url;
      try {
        url = new URL(raw, `http://127.0.0.1:${port}`);
      } catch {
        continue;
      }

      if (url.origin !== `http://127.0.0.1:${port}`) continue;
      if (!url.pathname.startsWith(target.basePath)) continue;
      if (isLikelyAssetPath(url.pathname)) paths.add(url.pathname);
    }
  }

  return paths;
}

async function readLocalAsset(pathname) {
  if (pathname.startsWith(`${target.basePath}/_next/static/`)) {
    const relative = pathname.slice(`${target.basePath}/_next/static/`.length);
    return readFile(path.join(appDir, ".next/static", relative));
  }

  if (pathname.startsWith(`${target.basePath}/`)) {
    const relative = pathname.slice(target.basePath.length + 1);
    return readFile(path.join(appDir, "public", relative));
  }

  throw new Error(`Unsupported local asset path: ${pathname}`);
}

async function addNextStaticAssets(files, pathMap) {
  const staticRoot = path.join(appDir, ".next/static");
  if (!(await exists(staticRoot))) return;

  for (const filePath of await walkFiles(staticRoot)) {
    const relative = path.relative(staticRoot, filePath).split(path.sep).join("/");
    const pathname = `${target.basePath}/_next/static/${relative}`;
    const key = `static/${relative}`;
    const data = await readFile(filePath);
    addFile(files, pathMap, pathname, key, data, contentTypeForPath(relative), cacheControlForPath(pathname));
  }
}

function addFile(files, pathMap, pathname, key, data, contentType, cacheControl) {
  const normalized = normalizePathname(pathname);
  if (!files.has(key)) {
    files.set(key, {
      contentType,
      cacheControl,
      data: Buffer.from(data).toString("base64"),
    });
  }

  pathMap.set(normalized, key);

  const encoded = encodePathname(normalized);
  if (encoded !== normalized) {
    pathMap.set(encoded, key);
  }

  if (normalized === target.basePath) {
    pathMap.set(`${target.basePath}/`, key);
  }
}

async function captureRoutes() {
  const files = new Map();
  const pathMap = new Map();
  const localAssets = new Set();
  const routes = await getTargetRoutes();
  const child = startStandaloneServer();

  try {
    for (const route of routes) {
      const pathname = new URL(route, `http://127.0.0.1:${port}`).pathname;
      if (isLikelyAssetPath(pathname) && !pathname.includes("/og/")) {
        try {
          const data = await readLocalAsset(pathname);
          addFile(files, pathMap, pathname, keyForPathname(pathname), data, contentTypeForPath(pathname), cacheControlForPath(pathname));
          continue;
        } catch {
          // Fall through to the standalone server for generated assets.
        }
      }

      const response = await fetchFromStandalone(route);
      const contentType = response.headers.get("content-type") ?? contentTypeForPath(pathname);
      const data = Buffer.from(await response.arrayBuffer());
      const key = keyForPathname(pathname);

      addFile(files, pathMap, pathname, key, data, contentType, cacheControlForPath(pathname));

      if (contentType.includes("text/html")) {
        const body = data.toString("utf8");
        for (const assetPath of extractLocalAssetPaths(body)) localAssets.add(assetPath);
      }
    }
  } finally {
    await stopServer(child);
  }

  await addNextStaticAssets(files, pathMap);

  for (const pathname of localAssets) {
    if (pathMap.has(normalizePathname(pathname))) continue;
    try {
      const data = await readLocalAsset(pathname);
      addFile(files, pathMap, pathname, `public/${pathname.slice(target.basePath.length + 1)}`, data, contentTypeForPath(pathname), cacheControlForPath(pathname));
    } catch {
      // Some captured URLs are handled by Next routes rather than public files.
    }
  }

  return { files, pathMap, routeCount: routes.length };
}

async function assertNoPre2024BlogPosts() {
  if (targetName !== "blog") return;

  const contentDir = path.join(appDir, "content/blog");
  const entries = await readdir(contentDir, { withFileTypes: true });
  const oldSlugs = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(contentDir, entry.name, "index.mdx");
    const contents = await readFile(filePath, "utf8");
    const match = contents.match(/^date:\s*["']?(\d{4})/m);
    if (!match) throw new Error(`Missing date frontmatter in ${path.relative(repoRoot, filePath)}`);
    if (Number(match[1]) < 2024) oldSlugs.push(entry.name);
  }

  if (oldSlugs.length > 0) {
    throw new Error(`Found ${oldSlugs.length} pre-2024 blog post(s): ${oldSlugs.slice(0, 10).join(", ")}`);
  }
}

async function serverSource(files, pathMap) {
  const fileEntries = [...files.entries()]
    .map(
      ([key, file]) =>
        `[${JSON.stringify(key)}, { contentType: ${JSON.stringify(file.contentType)}, cacheControl: ${JSON.stringify(
          file.cacheControl,
        )}, data: ${JSON.stringify(file.data)} }]`,
    )
    .join(",\n");
  const pathEntries = [...pathMap.entries()]
    .map(([pathname, key]) => `[${JSON.stringify(pathname)}, ${JSON.stringify(key)}]`)
    .join(",\n");

  return `const basePath = ${JSON.stringify(target.basePath)};
const files = new Map([
${fileEntries}
]);
const pathMap = new Map([
${pathEntries}
]);

function normalizePathname(pathname) {
  const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\\/+$/, "") : pathname;
  return withoutTrailingSlash || "/";
}

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function responseForPath(pathname, method) {
  const key = pathMap.get(normalizePathname(pathname));
  if (!key) return undefined;

  const file = files.get(key);
  if (!file) return undefined;

  const headers = new Headers();
  headers.set("Content-Type", file.contentType);
  headers.set("Cache-Control", file.cacheControl);

  return new Response(method === "HEAD" ? undefined : Buffer.from(file.data, "base64"), { headers });
}

Bun.serve({
  hostname: "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(new URL(basePath, url), 302);
    }

    const response = responseForPath(url.pathname, request.method);
    if (response) return response;

    return notFound();
  },
});
`;
}

await assertNoPre2024BlogPosts();
await rm(path.join(appDir, ".next"), { force: true, recursive: true });
await rm(path.join(appDir, ".source"), { force: true, recursive: true });
await rm(outputDir, { force: true, recursive: true });

await run("pnpm", ["turbo", "run", "build", `--filter=${target.filter}...`, "--force"]);

const standaloneServer = path.join(appDir, ".next/standalone", target.appDir, "server.js");
const standaloneStat = await stat(standaloneServer).catch(() => null);
if (!standaloneStat?.isFile()) {
  throw new Error(`Expected standalone server at ${path.relative(repoRoot, standaloneServer)}`);
}

const { files, pathMap, routeCount } = await captureRoutes();
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "server.ts"), await serverSource(files, pathMap));

const totalBytes = [...files.values()].reduce((sum, file) => sum + Math.floor((file.data.length * 3) / 4), 0);
console.log(
  `Prepared ${targetName} Compute static runtime from ${routeCount} source route(s) with ${pathMap.size} served path(s), ${files.size} embedded file(s), approx ${Math.round(
    totalBytes / 1024 / 1024,
  )} MB`,
);
