import { compileProxy } from "@prisma/proxy";
import { vercel, type VercelOptions } from "@prisma/proxy/vercel";
import site from "../../apps/site/vercel.json" with { type: "json" };
import docs from "../../apps/docs/vercel.json" with { type: "json" };

export function gatewayPlan(nextjs?: VercelOptions["nextjs"]) {
  // The other apps have no vercel.json; their routing stays in Next.js.
  return compileProxy(
    Object.entries({ site, docs, blog: {}, handbook: {}, eclipse: {} }).map(([name, config]) => ({
      name,
      mount: name === "site" ? "/" : `/${name}`,
      paths: name === "site" ? [] : [`/${name}.md`, `/${name}.mdx`],
      assets: [
        {
          prefix: `/${name}-static/_next`,
          destination: `${name === "site" ? "" : `/${name}`}/_next`,
        },
      ],
      routing: vercel(config, name === "site" ? { nextjs } : undefined),
    })),
  );
}
