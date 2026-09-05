import { describe, expect, it } from "vitest";
import { GradingEngine } from "../../features/grading";
import { PowerShellSimulatorRunner } from "../../features/runner";
import { powershellGrade3Course } from "./grade-3";

const solutions: Record<string, string> = {
  ex_powershell3_01_select_text_files_01: "Get-ChildItem | Where-Object Name -Like *.txt | Select-Object Name",
  ex_powershell3_02_count_files_01: "Get-ChildItem | Where-Object Type -eq file | Measure-Object",
};

describe("PowerShell curriculum draft", () => {
  it("seeds draft pipeline lessons for grade 3", () => {
    const lessons = powershellGrade3Course.chapters.flatMap((chapter) => chapter.lessons);

    expect(powershellGrade3Course.languageId).toBe("lang_powershell");
    expect(lessons.map((lesson) => lesson.slug)).toEqual(["select-text-files", "count-files"]);
    expect(lessons.every((lesson) => lesson.status === "draft")).toBe(true);
  });

  it("keeps every PowerShell pipeline task gradable through stdout tests", async () => {
    const exercises = powershellGrade3Course.chapters.flatMap((chapter) => chapter.lessons).flatMap((lesson) => lesson.exercises);

    expect(exercises).toHaveLength(2);
    for (const exercise of exercises) {
      expect(exercise.gradingMode).toBe("stdout");
      expect(exercise.testCases.some((testCase) => testCase.visibility === "public")).toBe(true);
      expect(exercise.testCases.some((testCase) => testCase.visibility === "hidden")).toBe(true);

      const result = await new GradingEngine(new PowerShellSimulatorRunner()).gradeExercise(exercise, solutions[exercise.id]);

      expect(result).toMatchObject({ passed: true });
    }
  });

  it("keeps PowerShell planned in the main catalog until the P12-04 routing checkpoint", async () => {
    const { languages } = await import("../catalog");
    const powershell = languages.find((language) => language.id === "lang_powershell");

    expect(powershell).toMatchObject({ status: "planned", levels: [] });
  });
});
