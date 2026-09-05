import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import { gradeHtmlStyleRequirements } from "./htmlStyleValidator";

const exercise: Exercise = {
  id: "ex_htmlcss3_01_01",
  lessonId: "lesson_htmlcss3_01_split_preview",
  type: "code",
  promptMd: "Style a profile card.",
  starterCode: "",
  gradingMode: "html_dom",
  timeoutMs: 3000,
  completionCriteria: "CSS requirements pass.",
  testCases: [],
  styleRequirements: [
    {
      id: "card-padding",
      order: 4,
      visibility: "public",
      kind: "declaration_equals",
      selector: ".profile-card",
      property: "padding",
      expectedValue: "24px",
      description: "profile-card has 24px padding.",
      required: true,
    },
    {
      id: "responsive-padding",
      order: 5,
      visibility: "hidden",
      kind: "media_declaration_equals",
      mediaQuery: "(max-width: 700px)",
      selector: ".profile-card",
      property: "padding",
      expectedValue: "16px",
      description: "profile-card uses smaller padding on narrow screens.",
      required: true,
    },
  ],
};

describe("gradeHtmlStyleRequirements", () => {
  it("passes normal and responsive CSS declarations", () => {
    const result = gradeHtmlStyleRequirements(exercise, {
      html: "",
      css: ".profile-card { padding: 24px; }\n@media (max-width: 700px) { .profile-card { padding: 16px; } }",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      testCaseId: "style:card-padding",
      passed: true,
      expectedStdout: "profile-card has 24px padding.",
      actualStdout: "24px",
    });
    expect(result[1]).toMatchObject({
      testCaseId: "style:responsive-padding",
      visibility: "hidden",
      passed: true,
      expectedStdout: undefined,
      actualStdout: "",
    });
  });

  it("fails when a required declaration is missing", () => {
    const result = gradeHtmlStyleRequirements(exercise, {
      html: "",
      css: ".profile-card { margin: 24px; }",
    });

    expect(result[0]).toMatchObject({
      testCaseId: "style:card-padding",
      passed: false,
      actualStdout: "",
    });
    expect(result[1]).toMatchObject({
      testCaseId: "style:responsive-padding",
      passed: false,
      actualStdout: "",
    });
  });
});
