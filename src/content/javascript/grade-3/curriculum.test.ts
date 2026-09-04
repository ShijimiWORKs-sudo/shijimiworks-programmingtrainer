import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../../features/grading";
import type { LanguageRunner, RunRequest } from "../../../features/runner";
import { runJavaScriptSource } from "../../../features/runner/javascriptRuntime";
import { javascriptGrade3Course } from "./curriculum";

const correctSolutions: Record<string, string> = {
  ex_js3_01_01: 'console.log("Hello, Programming Trainer!");\n',
  ex_js3_02_01: 'const language = "JavaScript";\nconsole.log(language);\n',
  ex_js3_03_01: 'const name = readline();\nconsole.log("Hello " + name);\n',
  ex_js3_04_01: "const a = Number(readline());\nconst b = Number(readline());\nconsole.log(a + b);\nconsole.log(a * b);\n",
  ex_js3_05_01: 'const score = Number(readline());\nif (score >= 60) {\n  console.log("pass");\n} else {\n  console.log("retry");\n}\n',
  ex_js3_06_01: "const n = Number(readline());\nfor (let i = 1; i <= n; i++) {\n  console.log(i);\n}\n",
  ex_js3_07_01: "let n = Number(readline());\nwhile (n > 0) {\n  console.log(n);\n  n = n - 1;\n}\n",
  ex_js3_08_01: 'const items = [readline(), readline(), readline()];\nitems[1] = "JavaScript";\nconsole.log(items[0]);\nconsole.log(items[1]);\nconsole.log(items[2]);\n',
  ex_js3_09_01: "const prices = { apple: 100, banana: 150 };\nconst item = readline();\nconst newPrice = Number(readline());\nprices[item] = newPrice;\nconsole.log(prices[item]);\n",
  ex_js3_10_01: "function double(number) {\n  return number * 2;\n}\n\nconst value = Number(readline());\nconsole.log(double(value));\n",
  ex_js3_10_02: "function triple(number) {\n  return number * 3;\n}\n\nconst value = Number(readline());\nconsole.log(triple(value));\n",
};

const runner: LanguageRunner = {
  initialize: async () => {},
  run: (request: RunRequest) => runJavaScriptSource(request.sourceCode, request.stdin),
  cancel: async () => {},
  reset: async () => {},
  dispose: async () => {},
};

describe("javascript grade 3 curriculum seed", () => {
  it("publishes ten routeable lessons with public and hidden coverage", () => {
    const lessons = javascriptGrade3Course.chapters[0].lessons;

    expect(javascriptGrade3Course).toMatchObject({
      id: "course_javascript_grade_3_foundation",
      languageId: "lang_javascript",
      levelId: "level_javascript_3",
      title: "JavaScript 3級",
    });
    expect(lessons).toHaveLength(10);
    expect(lessons.map((lesson) => lesson.status)).toEqual(Array.from({ length: 10 }, () => "published"));
    expect(lessons.map((lesson) => lesson.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const lesson of lessons) {
      expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);
      for (const exercise of lesson.exercises) {
        expect(exercise.testCases.map((testCase) => testCase.visibility)).toContain("public");
        expect(exercise.testCases.map((testCase) => testCase.visibility)).toContain("hidden");
      }
    }
  });

  it("grades every JavaScript 3級 exercise solution with the JavaScript runtime", async () => {
    const gradingEngine = new GradingEngine(runner);
    const exercises = javascriptGrade3Course.chapters.flatMap((chapter) => chapter.lessons).flatMap((lesson) => lesson.exercises);

    for (const exercise of exercises) {
      const result = await gradingEngine.gradeExercise(exercise, correctSolutions[exercise.id]);

      expect(result.passed, exercise.id).toBe(true);
      expect(result.passedRequired, exercise.id).toBe(result.totalRequired);
    }
  });

  it("keeps hidden-only JavaScript test data out of visible lesson text", () => {
    const lesson = javascriptGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_js3_03_input");
    const visibleText = [
      lesson?.objective,
      lesson?.explanationMd,
      lesson?.taskMd,
      lesson?.starterCode,
      lesson?.sampleInput,
      lesson?.sampleOutput,
      lesson?.constraints.join("\n"),
      lesson?.hints.join("\n"),
    ].join("\n");

    expect(visibleText).not.toContain("Nia");
    expect(visibleText).not.toContain("Hello Nia");
  });
});
