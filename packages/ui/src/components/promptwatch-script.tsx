import { PROMPTWATCH_PROJECT_ID, PROMPTWATCH_SCRIPT_SRC } from "../lib/promptwatch";

/**
 * Ungated Promptwatch visitor-analytics snippet. Renders a native `<script>`
 * so the client can read its project id from `document.currentScript`.
 * `async` keeps the third-party request off the render path; `currentScript`
 * is still set while an async classic script runs.
 * `data-track-errors="false"` turns off JS error reporting.
 */
export function PromptwatchScript() {
  return (
    <script
      async
      id="promptwatch"
      src={PROMPTWATCH_SCRIPT_SRC}
      data-project-id={PROMPTWATCH_PROJECT_ID}
      data-track-errors="false"
    />
  );
}
