import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { HtmlCssGrade1CurriculumPage } from "./HtmlCssGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("HtmlCssGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable HTML/CSS grade 1 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <HtmlCssGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("0 / 4 Lessons completed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-1/lessons/lesson_htmlcss1_01_bug_fix"
    );
  });

  it("shows completed state when all grade 1 lessons are passed", async () => {
    repositoryState.progressList = [
      "lesson_htmlcss1_01_bug_fix",
      "lesson_htmlcss1_02_specification_change",
      "lesson_htmlcss1_03_test_oriented",
      "lesson_htmlcss1_04_refactoring",
    ].map((lessonId) => markPassed(createInitialProgress("local-user", lessonId, "")));

    render(
      <MemoryRouter>
        <HtmlCssGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("4 / 4 Lessons completed")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML/CSS 1級 chapter progress")).toHaveTextContent("Completed");
  });
});
