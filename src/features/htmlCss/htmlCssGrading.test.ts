import { describe, expect, it } from "vitest";
import { htmlCssGrade3Course } from "../../content/html-css/grade-3";
import { gradeHtmlCssExercise } from "./htmlCssGrading";
import { getHtmlCssStarterFiles } from "./htmlCssProject";

describe("gradeHtmlCssExercise", () => {
  it("combines DOM and style requirements into one grade result", () => {
    const exercise = htmlCssGrade3Course.chapters[0].lessons[0].exercises[0];
    const result = gradeHtmlCssExercise(exercise, getHtmlCssStarterFiles(exercise));

    expect(result.passed).toBe(true);
    expect(result.passedRequired).toBe(5);
    expect(result.totalRequired).toBe(5);
    expect(result.results.map((candidate) => candidate.testCaseId)).toEqual([
      "dom:profile-card-main",
      "dom:profile-card-heading",
      "dom:profile-card-description",
      "style:profile-card-padding",
      "style:profile-card-responsive-padding",
    ]);
  });
});
