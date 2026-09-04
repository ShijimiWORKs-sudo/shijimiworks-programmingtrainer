import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../../features/grading";
import type { LanguageRunner, RunRequest } from "../../../features/runner";
import { runJavaScriptSource } from "../../../features/runner/javascriptRuntime";
import { javascriptGrade2Course } from "./curriculum";

const correctSolutions: Record<string, string> = {
  ex_js2_01_01: "function discountedPrice(price, rate) {\n  return Math.floor(price * (100 - rate) / 100);\n}\n\nconst price = Number(readline());\nconst rate = Number(readline());\nconsole.log(discountedPrice(price, rate));\n",
  ex_js2_02_01: "class Student {\n  constructor(name, score) {\n    this.name = name;\n    this.score = score;\n  }\n\n  label() {\n    return this.name + \":\" + this.score;\n  }\n}\n\nconst name = readline();\nconst score = Number(readline());\nconst student = new Student(name, score);\nconsole.log(student.label());\n",
  ex_js2_03_01: "function parseNumber(value) {\n  const number = Number(value);\n  if (Number.isNaN(number)) {\n    throw new Error(\"invalid\");\n  }\n  return number;\n}\n\nconst value = readline();\ntry {\n  const number = parseNumber(value);\n  console.log(\"number:\" + number);\n} catch (error) {\n  console.log(\"invalid\");\n}\n",
  ex_js2_04_01: "const numbers = readline().split(\" \").map((value) => Number(value));\nconst evenNumbers = numbers.filter((number) => number % 2 === 0);\nconst total = evenNumbers.reduce((sum, number) => sum + number, 0);\nconsole.log(total);\n",
  ex_js2_05_01: "const scores = readline().split(\" \").map((value) => Number(value));\n\nfunction highestScore(scores) {\n  let best = scores[0];\n  for (const score of scores) {\n    if (score > best) {\n      best = score;\n    }\n  }\n  return best;\n}\n\nconsole.log(highestScore(scores));\n",
  ex_js2_06_01: "class ScoreBook {\n  constructor(scores) {\n    this.scores = scores;\n  }\n\n  count() {\n    return this.scores.length;\n  }\n\n  maxScore() {\n    let best = this.scores[0];\n    for (const score of this.scores) {\n      if (score > best) {\n        best = score;\n      }\n    }\n    return best;\n  }\n\n  average() {\n    const total = this.scores.reduce((sum, score) => sum + score, 0);\n    return Math.floor(total / this.scores.length);\n  }\n}\n\nfunction parseScores(line) {\n  return line.split(\",\").map((part) => Number(part)).filter((score) => !Number.isNaN(score));\n}\n\nconst scores = parseScores(readline());\nconst book = new ScoreBook(scores);\nconsole.log(\"count:\" + book.count() + \",max:\" + book.maxScore() + \",avg:\" + book.average());\n",
};

const runner: LanguageRunner = {
  initialize: async () => {},
  run: (request: RunRequest) => runJavaScriptSource(request.sourceCode, request.stdin),
  cancel: async () => {},
  reset: async () => {},
  dispose: async () => {},
};

describe("javascript grade 2 curriculum seed", () => {
  it("publishes six routeable lessons with public and hidden coverage", () => {
    const lessons = javascriptGrade2Course.chapters[0].lessons;

    expect(javascriptGrade2Course).toMatchObject({
      id: "course_javascript_grade_2",
      languageId: "lang_javascript",
      levelId: "level_javascript_2",
      title: "JavaScript 2級",
    });
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "lesson_js2_01_function_return",
      "lesson_js2_02_classes",
      "lesson_js2_03_error_handling",
      "lesson_js2_04_array_methods",
      "lesson_js2_05_algorithm_debug",
      "lesson_js2_06_small_project",
    ]);
    for (const lesson of lessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual(["public", "hidden"]);
    }
  });

  it("grades every JavaScript 2級 exercise solution with the JavaScript runtime", async () => {
    const gradingEngine = new GradingEngine(runner);
    const exercises = javascriptGrade2Course.chapters.flatMap((chapter) => chapter.lessons).flatMap((lesson) => lesson.exercises);

    for (const exercise of exercises) {
      const result = await gradingEngine.gradeExercise(exercise, correctSolutions[exercise.id]);

      expect(result.passed, exercise.id).toBe(true);
      expect(result.passedRequired, exercise.id).toBe(result.totalRequired);
    }
  });

  it("keeps hidden-only JavaScript grade 2 data out of visible lesson text", () => {
    const lesson = javascriptGrade2Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_js2_02_classes");
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

    expect(visibleText).not.toContain("Ren");
    expect(visibleText).not.toContain("Ren:95");
  });
});
