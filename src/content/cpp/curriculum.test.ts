import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../features/grading";
import type { LanguageRunner, RunRequest } from "../../features/runner";
import { runCppSource } from "../../features/runner/cppRuntime";
import { cppGrade1Course } from "./grade-1";
import { cppGrade2Course } from "./grade-2";
import { cppGrade3Course } from "./grade-3";

const runner: LanguageRunner = {
  initialize: async () => undefined,
  run: (request: RunRequest) => runCppSource(request.sourceCode, request.stdin),
  cancel: async () => undefined,
  reset: async () => undefined,
  dispose: async () => undefined,
};

const allCppLessons = [
  ...cppGrade3Course.chapters.flatMap((chapter) => chapter.lessons),
  ...cppGrade2Course.chapters.flatMap((chapter) => chapter.lessons),
  ...cppGrade1Course.chapters.flatMap((chapter) => chapter.lessons),
];

describe("C++ curriculum", () => {
  it("publishes C++ grade 3, grade 2, and grade 1 lessons with public and hidden coverage", () => {
    expect(cppGrade3Course.chapters[0].lessons).toHaveLength(10);
    expect(cppGrade2Course.chapters[0].lessons).toHaveLength(6);
    expect(cppGrade1Course.chapters[0].lessons).toHaveLength(4);

    for (const lesson of allCppLessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
      for (const exercise of lesson.exercises) {
        expect(exercise.testCases.some((testCase) => testCase.visibility === "public")).toBe(true);
        expect(exercise.testCases.some((testCase) => testCase.visibility === "hidden")).toBe(true);
      }
    }
  });

  it("grades representative C++ lessons through the C++ runtime", async () => {
    const engine = new GradingEngine(runner);
    const grade3FunctionExercise = cppGrade3Course.chapters[0].lessons[9].exercises[1];
    const grade2DiscountExercise = cppGrade2Course.chapters[0].lessons[0].exercises[0];
    const grade1SpecExercise = cppGrade1Course.chapters[0].lessons[1].exercises[0];

    await expect(engine.gradeExercise(grade3FunctionExercise, grade3FunctionExercise.starterCode.replace("return number;", "return number * 3;"))).resolves.toMatchObject({ passed: true });
    await expect(engine.gradeExercise(grade2DiscountExercise, grade2DiscountExercise.starterCode.replace("return price;", "return price * (100 - rate) / 100;"))).resolves.toMatchObject({ passed: true });
    await expect(engine.gradeExercise(grade1SpecExercise, grade1SpecExercise.starterCode.replace("return 500;", "if (total >= 5000) {\n    return 0;\n  }\n  return 500;"))).resolves.toMatchObject({ passed: true });
  });

  it("keeps C++ hidden values out of visible project support files", () => {
    const visibleProjectText = cppGrade1Course.chapters[0].lessons
      .flatMap((lesson) => lesson.exercises)
      .flatMap((exercise) => exercise.project?.files ?? [])
      .map((file) => file.content)
      .join("\n");

    expect(visibleProjectText).not.toContain("5100");
    expect(visibleProjectText).not.toContain("100 40 75");
    expect(visibleProjectText).not.toContain("Nia");
    expect(visibleProjectText).not.toContain("Kai");
    expect(visibleProjectText).not.toContain("Ren");
  });
});
