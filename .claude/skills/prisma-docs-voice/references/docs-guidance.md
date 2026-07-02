# Docs guidance

Use this for docs, tutorials, educational content, and support-style replies.

## Docs voice

Docs should:

- Explain what the product or feature is.
- Tell the reader when to use it.
- Show the next action clearly.
- Break workflows into steps when useful.
- Use precise names and precise constraints.

Docs should not:

- Sound like launch copy.
- Hide important limitations.
- Replace instructions with slogans.
- Assume the reader knows Prisma product boundaries.

For overview pages and quickstarts:

- Put the real setup requirement near the start.
- Put important limitations where readers will actually see them.
- Avoid operational absolutes unless the source docs explicitly support them.

## Educational content

Educational content should:

- Teach through concrete examples.
- Explain why the workflow matters.
- Keep jargon under control.
- Stay grounded in real product behavior.

Educational content should not:

- Turn every paragraph into a pitch.
- Inflate routine functionality into a grand narrative.

## Support-style responses

Support-style replies should:

- Start by addressing the question directly.
- Acknowledge limitations or uncertainty clearly.
- Give the next action or decision point.
- Stay calm and specific.

Support-style replies should not:

- Sound defensive.
- Borrow website or launch language.
- Promise capabilities that are not confirmed.

## High-risk docs patterns

Flag these carefully:

- Claims that a workflow is automatic without showing the trigger or setup.
- Claims that there are no limits, no timeouts, or no cold starts without explicit documentation.
- Claims that a product works for any workload unless the docs clearly support that scope.
- Claims that remove all configuration steps when the actual workflow still needs setup.

## Example shift

Weak:

Prisma Postgres gives you a powerful database experience for modern apps.

Better:

Prisma Postgres is the managed PostgreSQL offering in the Prisma platform. Use the pooled connection string for application traffic and the direct connection string for migrations or Prisma Studio.
