/** Accept the page structurally so this shared package does not import an app's source. */
export async function getLLMText(page: {
  url: string;
  data: { title: string; getText: (format: "processed") => Promise<string> };
}) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
