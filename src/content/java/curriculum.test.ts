import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../features/grading";
import type { LanguageRunner, RunRequest } from "../../features/runner";
import { runJavaSource } from "../../features/runner/javaRuntime";
import { javaGrade1Course } from "./grade-1";
import { javaGrade2Course } from "./grade-2";
import { javaGrade3Course } from "./grade-3";

const runner: LanguageRunner = {
  initialize: async () => undefined,
  run: (request: RunRequest) => runJavaSource(request.sourceCode, request.stdin),
  cancel: async () => undefined,
  reset: async () => undefined,
  dispose: async () => undefined,
};

const allJavaLessons = [
  ...javaGrade3Course.chapters.flatMap((chapter) => chapter.lessons),
  ...javaGrade2Course.chapters.flatMap((chapter) => chapter.lessons),
  ...javaGrade1Course.chapters.flatMap((chapter) => chapter.lessons),
];

describe("Java curriculum", () => {
  it("publishes Java grade 3, grade 2, and grade 1 lessons with public and hidden coverage", () => {
    expect(javaGrade3Course.chapters[0].lessons).toHaveLength(10);
    expect(javaGrade2Course.chapters[0].lessons).toHaveLength(6);
    expect(javaGrade1Course.chapters[0].lessons).toHaveLength(4);

    for (const lesson of allJavaLessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
      for (const exercise of lesson.exercises) {
        expect(exercise.testCases.some((testCase) => testCase.visibility === "public")).toBe(true);
        expect(exercise.testCases.some((testCase) => testCase.visibility === "hidden")).toBe(true);
      }
    }
  });

  it("grades representative Java lessons through the Java runtime", async () => {
    const engine = new GradingEngine(runner);
    const grade3MethodExercise = javaGrade3Course.chapters[0].lessons[9].exercises[1];
    const grade2DiscountExercise = javaGrade2Course.chapters[0].lessons[0].exercises[0];
    const grade1SpecExercise = javaGrade1Course.chapters[0].lessons[1].exercises[0];

    await expect(engine.gradeExercise(grade3MethodExercise, grade3MethodExercise.starterCode.replace("return number;", "return number * 3;"))).resolves.toMatchObject({ passed: true });
    await expect(engine.gradeExercise(grade2DiscountExercise, grade2DiscountExercise.starterCode.replace("return price;", "return Math.floor(price * (100 - rate) / 100);"))).resolves.toMatchObject({ passed: true });
    await expect(engine.gradeExercise(grade1SpecExercise, grade1SpecExercise.starterCode.replace("return 500;", "if (total >= 5000) {\n      return 0;\n    }\n    return 500;"))).resolves.toMatchObject({ passed: true });
  });

  it("keeps Java hidden values out of visible project support files", () => {
    const visibleProjectText = javaGrade1Course.chapters[0].lessons
      .flatMap((lesson) => lesson.exercises)
      .flatMap((exercise) => exercise.project?.files ?? [])
      .map((file) => file.content)
      .join("\n");

    expect(visibleProjectText).not.toContain("5100");
    expect(visibleProjectText).not.toContain("100,40,75");
    expect(visibleProjectText).not.toContain("Nia");
    expect(visibleProjectText).not.toContain("Kai");
    expect(visibleProjectText).not.toContain("Ren");
  });
});
