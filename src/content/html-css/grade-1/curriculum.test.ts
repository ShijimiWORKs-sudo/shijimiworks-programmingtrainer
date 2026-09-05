import { describe, expect, it } from "vitest";
import { gradeHtmlCssExercise } from "../../../features/htmlCss/htmlCssGrading";
import { getHtmlCssStarterFiles } from "../../../features/htmlCss/htmlCssProject";
import { validateProjectExercise } from "../../../features/project/projectExercise";
import { htmlCssGrade1Course } from "./curriculum";

describe("html css grade 1 curriculum seed", () => {
  it("publishes four practical maintenance lessons", () => {
    expect(htmlCssGrade1Course).toMatchObject({
      id: "course_html_css_grade_1",
      languageId: "lang_html_css",
      levelId: "level_html_css_1",
      title: "HTML/CSS 1級",
    });
    expect(htmlCssGrade1Course.chapters[0].lessons).toHaveLength(4);
    expect(htmlCssGrade1Course.chapters[0].lessons.map((lesson) => lesson.status)).toEqual(Array(4).fill("published"));
  });

  it("keeps every lesson project valid and starter-gradable with hidden coverage", () => {
    for (const lesson of htmlCssGrade1Course.chapters[0].lessons) {
      const exercise = lesson.exercises[0];

      expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
      expect(exercise.domRequirements?.some((requirement) => requirement.visibility === "hidden")).toBe(true);
      expect(exercise.styleRequirements?.some((requirement) => requirement.visibility === "hidden")).toBe(true);
      expect(gradeHtmlCssExercise(exercise, getHtmlCssStarterFiles(exercise))).toMatchObject({
        passed: true,
        totalRequired: 5,
        passedRequired: 5,
      });
    }
  });
});
