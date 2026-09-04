import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javascriptGrade1Course } from "../content/javascript/grade-1";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaScriptGrade1CurriculumPage } from "./JavaScriptGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

function renderCurriculum() {
  render(
    <MemoryRouter>
      <JavaScriptGrade1CurriculumPage />
    </MemoryRouter>
  );
}

describe("JavaScriptGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable JavaScript grade 1 lessons and progress", async () => {
    renderCurriculum();

    expect(await screen.findByText("0 / 4 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByLabelText("JavaScript 1級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
      "href",
      "/languages/javascript/grade-1/lessons/lesson_js1_01_bug_fix"
    );
  });

  it("shows chapter complete when every JavaScript 1 lesson passed", async () => {
    repositoryState.progressList = javascriptGrade1Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    renderCurriculum();

    expect(await screen.findByText("4 / 4 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
