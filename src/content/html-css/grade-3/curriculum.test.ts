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
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(getHtmlCssStarterFiles(exercise).css).toContain(".profile-card");
  });
});
