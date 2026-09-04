import { describe, expect, it } from "vitest";
import { validateProjectExercise } from "../../../features/project/projectExercise";
import { getHtmlCssStarterFiles } from "../../../features/htmlCss/htmlCssProject";
import { htmlCssGrade3Course } from "./curriculum";

describe("html css grade 3 curriculum seed", () => {
  it("publishes a routeable split preview lesson with editable html and css files", () => {
    const lesson = htmlCssGrade3Course.chapters[0].lessons[0];
    const exercise = lesson.exercises[0];

    expect(htmlCssGrade3Course).toMatchObject({
      id: "course_html_css_grade_3_foundation",
      languageId: "lang_html_css",
      levelId: "level_html_css_3",
      title: "HTML/CSS 3級",
    });
    expect(lesson).toMatchObject({
      id: "lesson_htmlcss3_01_split_preview",
      title: "Lesson 01: split editor preview",
      status: "published",
    });
    expect(exercise.project).toMatchObject({
      entryFilePath: "index.html",
      files: [
        { path: "index.html", language: "html", editable: true },
        { path: "styles.css", language: "css", editable: true },
      ],
    });
    expect(exercise.gradingMode).toBe("html_dom");
    expect(exercise.testCases).toEqual([]);
    expect(exercise.domRequirements).toMatchObject([
      { id: "profile-card-main", visibility: "public", selector: "main.profile-card", required: true },
      { id: "profile-card-heading", visibility: "public", selector: "main.profile-card h1", required: true },
      { id: "profile-card-description", visibility: "hidden", selector: "main.profile-card p", required: true },
    ]);
    expect(exercise.styleRequirements).toMatchObject([
      { id: "profile-card-padding", visibility: "public", selector: ".profile-card", property: "padding", expectedValue: "24px", required: true },
      { id: "profile-card-responsive-padding", visibility: "hidden", selector: ".profile-card", property: "padding", expectedValue: "16px", required: true },
    ]);
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(getHtmlCssStarterFiles(exercise).css).toContain(".profile-card");
    expect(getHtmlCssStarterFiles(exercise).css).toContain("@media (max-width: 700px)");
  });
});
