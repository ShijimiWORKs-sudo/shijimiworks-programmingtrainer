import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../../features/grading";
import { validateProjectExercise } from "../../../features/project/projectExercise";
import type { LanguageRunner, RunRequest } from "../../../features/runner";
import { runJavaScriptSource } from "../../../features/runner/javascriptRuntime";
import { javascriptGrade1Course } from "./curriculum";

const correctSolutions: Record<string, string> = {
  ex_js1_01_01: "function normalizeName(name) {\n  return name.trim();\n}\n\nfunction buildGreeting(name) {\n  const normalized = normalizeName(name);\n  return \"Hello, \" + normalized;\n}\n\nconst name = readline();\nconsole.log(buildGreeting(name));\n",
  ex_js1_02_01: "function shippingFee(total) {\n  if (total >= 5000) {\n    return 0;\n  }\n  return 500;\n}\n\nfunction orderTotal(total) {\n  return total + shippingFee(total);\n}\n\nconst total = Number(readline());\nconsole.log(orderTotal(total));\n",
  ex_js1_03_01: "function parseScores(line) {\n  return line.split(\",\").map((part) => Number(part)).filter((score) => !Number.isNaN(score));\n}\n\nfunction passedCount(scores) {\n  return scores.filter((score) => score >= 70).length;\n}\n\nconst scores = parseScores(readline());\nconsole.log(passedCount(scores));\n",
  ex_js1_04_01: "function labelGrade(name, score) {\n  if (score >= 80) {\n    return name + \":A\";\n  }\n  return name + \":B\";\n}\n\nconst name1 = readline();\nconst score1 = Number(readline());\nconst name2 = readline();\nconst score2 = Number(readline());\n\nconsole.log(labelGrade(name1, score1));\nconsole.log(labelGrade(name2, score2));\n",
};

const runner: LanguageRunner = {
  initialize: async () => {},
  run: (request: RunRequest) => runJavaScriptSource(request.sourceCode, request.stdin),
  cancel: async () => {},
  reset: async () => {},
  dispose: async () => {},
};

describe("javascript grade 1 curriculum seed", () => {
  it("adds routeable practical lessons with safe project metadata", () => {
    const lessons = javascriptGrade1Course.chapters[0].lessons;

    expect(javascriptGrade1Course).toMatchObject({
      id: "course_javascript_grade_1",
      languageId: "lang_javascript",
      levelId: "level_javascript_1",
      title: "JavaScript 1級",
    });
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "lesson_js1_01_bug_fix",
      "lesson_js1_02_specification_change",
      "lesson_js1_03_test_oriented",
      "lesson_js1_04_refactoring",
    ]);
    for (const lesson of lessons) {
      const project = lesson.exercises[0].project;
      expect(lesson.status).toBe("published");
      expect(project?.entryFilePath).toBe("main.js");
      expect(project ? validateProjectExercise(project) : ["missing project"]).toEqual([]);
    }
  });

  it("grades every JavaScript 1級 exercise solution with the JavaScript runtime", async () => {
    const gradingEngine = new GradingEngine(runner);
    const exercises = javascriptGrade1Course.chapters.flatMap((chapter) => chapter.lessons).flatMap((lesson) => lesson.exercises);

    for (const exercise of exercises) {
      const result = await gradingEngine.gradeExercise(exercise, correctSolutions[exercise.id]);

      expect(result.passed, exercise.id).toBe(true);
      expect(result.passedRequired, exercise.id).toBe(result.totalRequired);
    }
  });

  it("keeps hidden-only JavaScript grade 1 data out of visible project support files", () => {
    const supportText = javascriptGrade1Course.chapters[0].lessons
      .flatMap((lesson) => lesson.exercises)
      .flatMap((exercise) => exercise.project?.files ?? [])
      .filter((file) => !file.editable)
      .map((file) => file.content)
      .join("\n");

    expect(supportText).not.toContain("5100");
    expect(supportText).not.toContain("100,no,40,75");
    expect(supportText).not.toContain("Nia");
    expect(supportText).not.toContain("Kai");
  });
});
