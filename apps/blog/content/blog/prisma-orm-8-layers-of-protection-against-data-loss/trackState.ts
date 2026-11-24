// Shared by the interactive figure (a client component) and its static
// fallback (rendered on the server), so it lives outside both.
export type TrackState = "done" | "stop" | "lost" | "skip" | "todo" | "now";

// "stop" is a stage that refused the change. "lost" is an outcome: nothing
// refused, and the data is gone.
export const TRACK_STATE_TEXT: Record<TrackState, string> = {
  done: "passed",
  stop: "stopped here",
  lost: "data lost",
  skip: "did not run",
  todo: "not reached yet",
  now: "in progress",
};
