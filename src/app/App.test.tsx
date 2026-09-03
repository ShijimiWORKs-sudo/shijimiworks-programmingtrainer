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
    [routePaths.pythonGrade3, "Python 3級"],
    [routePaths.pythonGrade3Lesson("lesson_py3_foundation_workspace"), "Lesson Workspace"],
    [routePaths.history, "Learning History"],
    [routePaths.settings, "Settings"],
  ])("renders %s", (path, expectedText) => {
    renderRoute(path);

    expect(screen.getByRole("heading", { name: expectedText })).toBeInTheDocument();
  });
});

