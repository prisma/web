// Dumps a zone's redirect table as JSON on stdout.
//
// Run as a child process, and from the app's own directory: importing
// `next.config.mjs` runs `createMDX()`, which kicks off an esbuild compile of
// `source.config.ts` relative to the current working directory. That work is
// irrelevant here — the redirect array is read synchronously at import — but it
// can reject after the fact and take the process down, so this exits the moment
// the table is written.
import { loadZone } from "./redirect-tables.mjs";

process.on("uncaughtException", () => process.exit(0));
process.on("unhandledRejection", () => process.exit(0));

const zone = process.argv[2];
const { entries } = await loadZone(zone);
process.stdout.write(JSON.stringify(entries), () => process.exit(0));
