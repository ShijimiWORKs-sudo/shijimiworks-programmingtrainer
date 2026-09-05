import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import { gradeHtmlDomExercise } from "./htmlDomValidator";

const exercise: Exercise = {
  id: "ex_htmlcss3_01_01",
  lessonId: "lesson_htmlcss3_01_split_preview",
  type: "code",
  promptMd: "Create a profile card.",
  starterCode: "",
  gradingMode: "html_dom",
  timeoutMs: 3000,
  completionCriteria: "DOM requirements pass.",
  testCases: [],
  domRequirements: [
    {
      id: "main-card",
      order: 1,
      visibility: "public",
      kind: "selector_exists",
      selector: "main.profile-card",
      description: "main.profile-card exists.",
      required: true,
    },
    {
      id: "heading-text",
      order: 2,
      visibility: "public",
      kind: "text_includes",
      selector: "h1",
      expectedText: "Programming Trainer",
      description: "h1 includes Programming Trainer.",
      required: true,
    },
    {
      id: "private-description",
      order: 3,
      visibility: "hidden",
      kind: "selector_exists",
      selector: "main.profile-card p",
      description: "description paragraph exists.",
      required: true,
    },
  ],
};

describe("gradeHtmlDomExercise", () => {
  it("passes required DOM requirements", () => {
    const result = gradeHtmlDomExercise(exercise, {
      html: '<main class="profile-card"><h1>Programming Trainer</h1><p>Learn HTML.</p></main>',
      css: "",
    });

    expect(result.passed).toBe(true);
    expect(result.passedRequired).toBe(3);
    expect(result.totalRequired).toBe(3);
  });

  it("reports public failures without exposing hidden selector details", () => {
    const result = gradeHtmlDomExercise(exercise, {
      html: '<main class="profile-card"><h1>Trainer</h1></main>',
      css: "",
    });

    expect(result.passed).toBe(false);
    expect(result.results[1]).toMatchObject({
      testCaseId: "dom:heading-text",
      visibility: "public",
      passed: false,
      expectedStdout: "h1 includes Programming Trainer.",
      actualStdout: "Trainer",
    });
    expect(result.results[2]).toMatchObject({
      testCaseId: "dom:private-description",
      visibility: "hidden",
      passed: false,
      expectedStdout: undefined,
      actualStdout: "",
    });
  });

  it("validates attribute equality", () => {
    const result = gradeHtmlDomExercise(
      {
        ...exercise,
        domRequirements: [
          {
            id: "link-target",
            order: 1,
            visibility: "public",
            kind: "attribute_equals",
            selector: "a",
            attributeName: "href",
            expectedValue: "https://example.com",
            description: "link points to the expected URL.",
            required: true,
          },
        ],
      },
      {
        html: '<a href="https://example.com">Example</a>',
        css: "",
      }
    );

    expect(result.passed).toBe(true);
  });
});
