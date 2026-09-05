import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cppGrade1Course } from "../content/cpp/grade-1";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CppGrade1CurriculumPage } from "./CppGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CppGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable C++ grade 1 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CppGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "C++ 1級" })).toBeInTheDocument();
    expect(screen.getByLabelText("C++ 1級 chapter progress")).toHaveTextContent("0 / 4 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
      "href",
      "/languages/cpp/grade-1/lessons/lesson_cpp1_01_bug_fix"
    );
  });

  it("shows chapter complete when every C++ 1 lesson passed", async () => {
    repositoryState.progressList = cppGrade1Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CppGrade1CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("C++ 1級 chapter progress")).toHaveTextContent("4 / 4 Lessons completed"));
    expect(screen.getByLabelText("C++ 1級 chapter progress")).toHaveTextContent("Completed");
  });
});
