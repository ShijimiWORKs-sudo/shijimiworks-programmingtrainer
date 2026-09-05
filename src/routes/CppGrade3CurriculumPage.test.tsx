import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cppGrade3Course } from "../content/cpp/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CppGrade3CurriculumPage } from "./CppGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CppGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable C++ grade 3 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CppGrade3CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "C++ 3級" })).toBeInTheDocument();
    expect(screen.getByLabelText("C++ 3級 chapter progress")).toHaveTextContent("0 / 10 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: cout/ })).toHaveAttribute(
      "href",
      "/languages/cpp/grade-3/lessons/lesson_cpp3_01_cout"
    );
    expect(screen.getByRole("link", { name: /Lesson 10: 関数/ })).toHaveAttribute(
      "href",
      "/languages/cpp/grade-3/lessons/lesson_cpp3_10_functions"
    );
  });

  it("shows chapter complete when every C++ 3 lesson passed", async () => {
    repositoryState.progressList = cppGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CppGrade3CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("C++ 3級 chapter progress")).toHaveTextContent("10 / 10 Lessons completed"));
    expect(screen.getByLabelText("C++ 3級 chapter progress")).toHaveTextContent("Completed");
  });
});
