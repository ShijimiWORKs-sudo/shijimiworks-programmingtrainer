import { describe, expect, it } from "vitest";
import { rubyGrade1Course } from "./grade-1";
import { rubyGrade2Course } from "./grade-2";
import { rubyGrade3Course } from "./grade-3";

const courses = [rubyGrade3Course, rubyGrade2Course, rubyGrade1Course];

describe("Ruby curriculum", () => {
  it("publishes Ruby grade 3, grade 2, and grade 1 lessons with runnable exercises", () => {
    expect(rubyGrade3Course.chapters[0].lessons).toHaveLength(10);
    expect(rubyGrade2Course.chapters[0].lessons).toHaveLength(6);
    expect(rubyGrade1Course.chapters[0].lessons).toHaveLength(4);

    for (const course of courses) {
      for (const lesson of course.chapters.flatMap((chapter) => chapter.lessons)) {
        expect(lesson.status).toBe("published");
        expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);

        for (const exercise of lesson.exercises) {
          expect(exercise.gradingMode).toBe("stdout");
          expect(exercise.starterCode).toContain("\n");
          expect(exercise.testCases.some((testCase) => testCase.visibility === "public")).toBe(true);
          expect(exercise.testCases.some((testCase) => testCase.visibility === "hidden")).toBe(true);
        }
      }
    }
  });

  it("keeps Ruby lesson 10 as a single lesson with multiple exercises", () => {
    const lesson10 = rubyGrade3Course.chapters[0].lessons.find((lesson) => lesson.id === "lesson_ruby3_10_methods");

    expect(lesson10?.exercises.map((exercise) => exercise.id)).toEqual(["ex_ruby3_10_01", "ex_ruby3_10_02"]);
  });

  it("does not expose hidden Ruby grade 1 support values through visible project files", () => {
    const visibleSupport = rubyGrade1Course.chapters[0].lessons
      .flatMap((lesson) => lesson.exercises)
      .flatMap((exercise) => exercise.project?.files ?? [])
      .map((file) => file.content)
      .join("\n");

    expect(visibleSupport).toContain("Aki");
    expect(visibleSupport).toContain("4800");
    expect(visibleSupport).toContain("80, 65, 90");
    expect(visibleSupport).toContain("Yui");
    expect(visibleSupport).not.toContain("Ren");
    expect(visibleSupport).not.toContain("5100");
    expect(visibleSupport).not.toContain("100");
    expect(visibleSupport).not.toContain("Nia");
    expect(visibleSupport).not.toContain("Kai");
  });
});
