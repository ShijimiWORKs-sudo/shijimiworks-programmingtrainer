import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import { buildHtmlCssPreviewDocument, getHtmlCssStarterFiles, parseHtmlCssFiles, serializeHtmlCssFiles } from "./htmlCssProject";

const exercise: Exercise = {
  id: "ex_htmlcss3_01_01",
  lessonId: "lesson_htmlcss3_01_split_preview",
  type: "code",
  promptMd: "Create a small page.",
  starterCode: "<h1>Hello</h1>\n",
  project: {
    entryFilePath: "index.html",
    files: [
      { path: "index.html", language: "html", content: "<h1>Hello</h1>\n", editable: true, purpose: "entry" },
      { path: "styles.css", language: "css", content: "h1 { color: teal; }\n", editable: true, purpose: "support" },
    ],
  },
  gradingMode: "stdout",
  timeoutMs: 3000,
  completionCriteria: "Preview renders the page.",
  testCases: [],
};

describe("html css project helpers", () => {
  it("reads starter html and css from project files", () => {
    expect(getHtmlCssStarterFiles(exercise)).toEqual({
      html: "<h1>Hello</h1>\n",
      css: "h1 { color: teal; }\n",
    });
  });

  it("serializes and parses progress snapshots", () => {
    const files = { html: "<main>Changed</main>", css: "main { display: grid; }" };

    expect(parseHtmlCssFiles(serializeHtmlCssFiles(files), getHtmlCssStarterFiles(exercise))).toEqual(files);
  });

  it("builds a sandbox-friendly preview document without executable script tags", () => {
    const document = buildHtmlCssPreviewDocument({
      html: '<button onclick="window.top.leak = true">Run</button><script>window.top.leak = true</script>',
      css: "button { color: red; }</style><script>bad()</script>",
    });

    expect(document).toContain("button { color: red; }<\\/style>");
    expect(document).not.toContain("<script>window.top.leak");
    expect(document).not.toContain("onclick=");
  });
});
