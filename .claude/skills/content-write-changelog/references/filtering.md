# Filtering: what reaches the public changelog

Run this on every candidate, including the ones that sit under a product heading in someone else's summary. Give each candidate exactly one verdict. When you are unsure, flag it. Every flag and every exclusion goes into the triage note with a one-line reason, so nothing is dropped silently.

## The baseline test

A changelog records what changed for the user, not how the team worked.

Include user-visible behavior changes, new capabilities, fixes a reader would notice, performance gains stated as an effect, breaking changes, deprecations, and retirements.

Exclude dependency bumps with no user effect, refactors, CI and build changes, repository configuration, test-only changes, and changes to internal documentation.

## The four verdicts

### Publish, or rewrite

Publish a shipped change to a public product as it is. Rewrite a change that carries a real benefit wrapped in internal detail: strip the detail and keep the effect.

### Flag

Pull the item from the entry and list it for a human decision when:

- you cannot confirm that the capability is public, for example a feature that is rolling out, limited to eligible accounts, or switched on by a flag
- it touches pricing, plan limits, a launch date, or a maturity label, and no public page states it
- it reverts something an earlier entry announced
- it is a fix with no user-visible change you can name
- you are not sure

### Exclude

Never publish:

- **Internal names.** Codenames, internal tools, internal agents, and anything that is not in the public product vocabulary.
- **Internal references.** Issue-tracker IDs, chat channels, dashboards, and internal links.
- **Internal process.** CI, builds, dependency bumps, repository configuration, SEO, analytics, consent, and tracking.
- **Implementation detail.** Which vendor, model, or runtime powers a feature, how the infrastructure is laid out, and how a rollout is staged.
- **Security mechanics.** How a vulnerability worked, what a credential looks like, and how tokens are checked.
- **People and customers.** Customer names, support-ticket details, and the names or email addresses of individuals.

## The strip test

Remove the internal detail from a line and look at what is left.

- Nothing a reader can use: exclude.
- A real benefit: rewrite it as user value.
- You cannot tell: flag.

## Changes from private repositories

Much of the platform is built in private repositories. Whether the repository is public does not decide the verdict. Whether the user can see the change does.

Publish a Console workflow, a CLI command, a REST API route, a platform behavior, or a docs page. Describe what the user sees, link a public docs page when one exists, and otherwise link nothing. Add the item to the triage note as "no public PR".

Exclude work that stays internal even though the product is public: how builds run, how a rollout is staged, where a service is hosted, and observability plumbing.

Never link a private pull request. The link returns 404 for readers and gives away the repository name.

## Products that are not generally available

A product in Early Access or in release candidates often has a public repository full of internal engineering. Apply the test to each line, not to the repository.

Publish a change that alters what a user can do or see: a new capability in the schema, a CLI command or flag, an editor feature, a query API addition, or a support policy. Keep the wording to what the release notes say.

Exclude parser and compiler rewrites, internal type machinery, project close-outs, and architecture records.

State the product's maturity once per entry, in the wording the docs use today. A change to a product before its public launch is not publishable.

## Guides and articles

Blog posts and docs guides are written for users, so list them. Link the published page and never the pull request that added it.

Skip a post about an internal tool. Skip site mechanics such as redirects, metadata, images, and copy tweaks.

A guide that is the main reference for a feature covered above is linked there, not repeated in the list.

## Security fixes

State the outcome, not the exploit. "Connection strings are now redacted from error logs" is publishable. The code path that leaked them is not.

A dependency update that resolves a published advisory can be one neutral line. Name the advisory only if the public pull request already does.

When in doubt, flag the item for a security reviewer.

## Incidents

A fix that follows an incident is published as the fix. Leave out the incident, the dates, the number of customers affected, and the cause.

## People and customers

Replace a named customer with a neutral phrase. "Fixed a replication lag issue reported by Acme" becomes "Fixed a replication lag issue that affected some databases".
