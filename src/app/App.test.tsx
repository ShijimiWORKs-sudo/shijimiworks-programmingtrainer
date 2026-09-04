import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routePaths } from "./routePaths";
import { createTestRouter } from "./router";

function renderRoute(path: string) {
  render(<RouterProvider router={createTestRouter([path])} />);
}

describe("App routes", () => {
  it.each([
    [routePaths.home, "Programming Trainer"],
    [routePaths.languages, "Language Select"],
    [routePaths.python, "Python Level Select"],
    [routePaths.pythonGrade1, "Python 1級"],
    [routePaths.pythonGrade1Lesson("lesson_py1_01_bug_fix"), "Lesson 01: bug fix"],
    [routePaths.pythonGrade1Lesson("lesson_py1_02_specification_change"), "Lesson 02: specification change"],
    [routePaths.pythonGrade1Lesson("lesson_py1_03_test_oriented"), "Lesson 03: test-oriented task"],
    [routePaths.pythonGrade2, "Python 2級"],
    [routePaths.pythonGrade2Lesson("lesson_py2_01_function_return"), "Lesson 01: 関数の戻り値"],
    [routePaths.pythonGrade2Lesson("lesson_py2_02_classes"), "Lesson 02: class"],
    [routePaths.pythonGrade2Lesson("lesson_py2_03_exceptions"), "Lesson 03: exception"],
    [routePaths.pythonGrade2Lesson("lesson_py2_04_virtual_file_io"), "Lesson 04: virtual file I/O"],
    [routePaths.pythonGrade2Lesson("lesson_py2_05_algorithm_debug"), "Lesson 05: algorithm debug"],
    [routePaths.pythonGrade2Lesson("lesson_py2_06_small_project"), "Lesson 06: small project"],
    [routePaths.pythonGrade3, "Python 3級"],
    [routePaths.pythonGrade3Challenge("challenge_py3_basic_review"), "Python 3級 章末課題: 基礎総復習"],
    [routePaths.pythonGrade3MockExam("mock_exam_py3_trial"), "Python 3級 模擬試験"],
    [routePaths.pythonGrade3MockExamResult("mock_exam_py3_trial"), "Mock Exam Result"],
    [routePaths.pythonGrade3Lesson("lesson_py3_01_print"), "Lesson 01: print / 出力"],
    [routePaths.history, "Learning History"],
    [routePaths.settings, "Settings"],
  ])("renders %s", (path, expectedText) => {
    renderRoute(path);

    expect(screen.getByRole("heading", { name: expectedText })).toBeInTheDocument();
  });
});


