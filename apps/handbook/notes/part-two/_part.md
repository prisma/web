# Part II: Building the first version

Status: first draft requested in chat, 2026-10-01.

## Shane's notes from the conversation

- "scope -- what needs to be in vs. out?"
- "building with AI ... the way we think about MVPs and risk etc is different. we can build without guilt"
- "the attention span of a user"
- "basics of UX"
- "journeys, JTBDs, happy paths"
- "onboarding concepts"
- "using Prisma product builder (I can explain more)"
- "analytics and tracking"
- "support and feedback"
- "we need to include narrative about specifically how to actually build. using the AI tools, setting up with Prisma, coding, deploying, getting a live URL to give to a friend etc."

## Agreed boundary

Shane: "Part 2 can get 'getting the first version live enough to show a friend' and part 3 can be the 'real' stuff like adding payments, tracking, etc. ie. how to get it ready to give to the community, not just a friend."

Part III also includes basic marketing/GTM, reaching the intended people, and clear messaging. Its agreed title is "Getting ready to launch".

## Accepted outline

The assistant proposed the following chapters. Shane responded: "ok great, can you please draft up the pages for part 2 right now?"

8. What your first version is for
9. Choose one useful journey
10. Design for someone's attention
11. Get your tools and Prisma set up
12. Build the first working flow
13. Make it work with real data
14. Test it, fix it, and keep going
15. Get a live URL
16. Give it to a friend

The accepted outline includes practical AI instructions, checking results, recovering from broken changes, and a basic usable experience before the friend tries it. Analytics instrumentation, payments, organised support, and community outreach belong to Part III.

## Draft choices for review

- Continue Part I's explicitly hypothetical freelance designer and client feedback example. No real customer, test result, quotation, or personal anecdote is implied.
- Use a narrow request-and-response flow: a designer asks for a decision on a specific draft, a client responds, and the designer reads the response.
- Prompt examples are newly drafted teaching material for review, not instructions Shane has previously used.
- Leave the exact Product Builder entry point, setup, account requirements, UI labels, and deployment path as TODO(shane) until Shane explains them. Do not treat a general Prisma CLI workflow as the Product Builder workflow.
- Prisma references support the broad database and hosting explanations. No app is created or deployed as part of drafting the handbook.

## Agreed editorial refinement (2026-10-02)

Shane asked to preserve the voice and most of the wording, while fixing passages that introduce things without enough context. His example was the sudden mention of project creation and notifications when explaining the designer's job.

Before-and-after examples were reviewed in chat. Shane approved introducing a feature as a possibility, explaining its connection to the task, and establishing a change of circumstances before describing its consequences. Apply this through small edits to the affected passages, rather than rewriting whole chapters.

The pass applies that approach across Parts I and II. It clarifies the portal example, hypothetical reminders and screens, the move from sample content to saved user work, and references to client access and feedback. The three sample revisions approved in chat are included. Chapter order, scope, and the pending Product Builder walkthrough are unchanged.

## Approved tool choice (2026-10-20)

Product Builder will not be available for a while. Shane wants readers to choose
ChatGPT or Claude and confirmed that both have a directory plugin or connector.
Treat both choices equally.

Shane proposed a tab that switches the page's instructions and persists through
the book. He approved implementing a single selector near the title on relevant
chapters, retaining shared explanations and remembering the selection across
navigation and browser refreshes.

- Setup, real data, and publishing now contain instructions for each tool.
- The Claude route names Claude Code where working on project files matters.
- ChatGPT instructions initially named Work and Sites. Shane subsequently
  corrected the hosting direction to Prisma; see the correction below.
- Both routes still need a full fresh-account trial before the handbook claims
  a verified end-to-end walkthrough. No starter repository or live sample app
  was created as part of adding the selector.
- The Product Builder TODOs above describe the earlier draft and are superseded
  by these two tool choices.

## Account setup and browser workflow (2026-10-20)

Shane: "I think we're missing a section on helping the person get set up with
these tools and accounts though. they'll need either ChatGPT or Claude, and
they'll need a Prisma account too."

Shane: "ideally these can be easy and free or cheap, without installing things
like node or bun, or dropping to the CLI."

- Added account setup before the build brief, using the existing tool selector.
- Use browser sessions: ChatGPT Work, or Claude Code in the cloud.
  The AI runs development tools remotely; the reader uses browser forms and chat.
- The first account draft incorrectly required GitHub for Prisma sign-in.
  GitHub is needed for Claude Code to store files; see Shane's correction below.
- Link current plan information and show monthly prices checked on 2026-10-20.
  Use existing access first, avoid an annual commitment for a trial, and require
  approval in the build prompt before adding a paid service.
- Claude's official MCP docs confirm that claude.ai connectors are delivered to
  cloud sessions. Replaced the old terminal connection instructions accordingly.
- Still to verify before publication: the minimum ChatGPT plan with all required
  features, and both complete build-to-preview paths with new accounts and no
  local installations. Documentation research is not a completed account trial.

## Correction: Prisma sign-in and deployment

Shane: "prisma also allows login with email/pass and google."

Shane: "we should be guiding the user to create and deploy the app with Prisma,
not with ChatGPT sites."

- Prisma sign-in offers email/password, Google, and GitHub. The common account
  setup must not require GitHub.
- Keep GitHub signup and repository instructions in the Claude Code variant.
- ChatGPT and Claude are the tools doing the work. Both create the application
  with Prisma's starter workflow and deploy it to Prisma Compute, with
  Prisma Postgres for the database. Sites is no longer a route in this handbook.
- Make Prisma explicit in the starter prompt, data chapter, and friend-trial
  deployment instructions. Keep the reader's actions in the browser and have
  the AI run development commands in its cloud environment.
- Verify deployment authorization separately from the Prisma plugin connection
  during the pending walkthroughs. No successful end-to-end trial is implied.
