// Where a chapter is in Shane's dictation workflow (see AUTHORING.md). Shown
// as a badge next to the title so a reader of a preview build knows what
// they are looking at. Omit the frontmatter field once a chapter is published.
export const CHAPTER_STATUS = ["stub", "dictated", "structured", "reviewed"] as const;
export type ChapterStatus = (typeof CHAPTER_STATUS)[number];
