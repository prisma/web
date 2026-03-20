import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const delivery = req.headers.get("x-github-delivery") ?? "unknown";
  const payload = await req.text();

  const sig = req.headers.get("x-hub-signature-256") ?? "";
  const expectedBuf = createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!).update(payload).digest();
  const sigBuf = Buffer.from(sig.replace("sha256=", ""), "hex");
  if (expectedBuf.length !== sigBuf.length || !timingSafeEqual(expectedBuf, sigBuf)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  if (event !== "pull_request") {
    return new Response("Ignored", { status: 200 });
  }

  let body: ReturnType<typeof JSON.parse>;
  try {
    body = JSON.parse(payload);
  } catch (err) {
    console.error(`[${delivery}] Failed to parse payload:`, err, payload);
    return new Response("Invalid payload", { status: 400 });
  }
  if (body.action !== "opened") {
    return new Response("Ignored", { status: 200 });
  }

  const pr = body.pull_request;

  const isMember = pr.author_association === "MEMBER";

  const teamRes = await fetch(
    `https://api.github.com/orgs/prisma/teams/dev-connections-write/memberships/${pr.user.login}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BOT_TOKEN_PR_LINEAR_WEBHOOK!}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const isTeamMember = teamRes.status === 200;
  
  if (isMember || isTeamMember) {
    return new Response("Internal contributor, skipping", { status: 200 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let res: Response;
  try {
    res = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.LINEAR_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          mutation CreateIssue($input: IssueCreateInput!) {
            issueCreate(input: $input) {
              success
              issue { identifier url }
            }
          }
        `,
        variables: {
          input: {
            teamId: process.env.LINEAR_TEAM_ID!,
            title: `Review PR #${pr.number}: ${pr.title}`,
            description: `**PR:** [#${pr.number}](${pr.html_url})\n**Author:** @${pr.user.login}\n**Branch:** \`${pr.head.ref}\` → \`${pr.base.ref}\`\n\n${pr.body ?? "_No description provided._"}`,
          },
        },
      }),
    });
  } catch (err) {
    clearTimeout(timeout);
    console.error(`[${delivery}] Linear request failed:`, err);
    return new Response("Failed to create Linear issue", { status: 500 });
  }
  clearTimeout(timeout);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    console.error(`[${delivery}] Linear returned non-JSON response (status ${res.status})`);
    return new Response("Failed to create Linear issue", { status: 500 });
  }

  const result = data as { data?: { issueCreate?: { success: boolean; issue?: { identifier: string; url: string } } } };

  if (!result.data?.issueCreate?.success) {
    console.error(`[${delivery}] Linear error:`, JSON.stringify(data));
    return new Response("Failed to create Linear issue", { status: 500 });
  }

  const issue = result.data.issueCreate.issue!;
  console.log(`[${delivery}] Created ${issue.identifier}: ${issue.url}`);
  return new Response("OK", { status: 200 });
}