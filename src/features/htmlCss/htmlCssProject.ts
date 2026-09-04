import type { Exercise, ProjectExerciseFile } from "../../domain/curriculum";

export interface HtmlCssFiles {
  html: string;
  css: string;
}

const snapshotPrefix = "programming-trainer:html-css:v1\n";

function findFile(files: ProjectExerciseFile[], language: string, fallbackPath: string) {
  return files.find((file) => file.language === language) ?? files.find((file) => file.path === fallbackPath);
}

export function getHtmlCssStarterFiles(exercise: Exercise): HtmlCssFiles {
  const files = exercise.project?.files ?? [];
  const htmlFile = findFile(files, "html", exercise.project?.entryFilePath ?? "index.html");
  const cssFile = findFile(files, "css", "styles.css");

  return {
    html: htmlFile?.content ?? exercise.starterCode,
    css: cssFile?.content ?? "",
  };
}

export function serializeHtmlCssFiles(files: HtmlCssFiles) {
  return snapshotPrefix + JSON.stringify(files);
}

export function parseHtmlCssFiles(value: string, fallback: HtmlCssFiles): HtmlCssFiles {
  if (!value.startsWith(snapshotPrefix)) {
    return value.trim().length > 0 ? { ...fallback, html: value } : fallback;
  }

  try {
    const parsed = JSON.parse(value.slice(snapshotPrefix.length)) as Partial<HtmlCssFiles>;
    return {
      html: typeof parsed.html === "string" ? parsed.html : fallback.html,
      css: typeof parsed.css === "string" ? parsed.css : fallback.css,
    };
  } catch {
    return fallback;
  }
}

export function sanitizePreviewHtml(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function escapeStyleBreakout(css: string) {
  return css.replace(/<\/style/gi, "<\\/style");
}

export function buildHtmlCssPreviewDocument(files: HtmlCssFiles) {
  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<style>",
    escapeStyleBreakout(files.css),
    "</style>",
    "</head>",
    "<body>",
    sanitizePreviewHtml(files.html),
    "</body>",
    "</html>",
  ].join("\n");
}
