import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cppGrade2Course } from "../content/cpp/grade-2";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CppGrade2CurriculumPage } from "./CppGrade2CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CppGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable C++ grade 2 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CppGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "C++ 2級" })).toBeInTheDocument();
    expect(screen.getByLabelText("C++ 2級 chapter progress")).toHaveTextContent("0 / 6 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: 関数の戻り値/ })).toHaveAttribute(
      "href",
      "/languages/cpp/grade-2/lessons/lesson_cpp2_01_function_return"
    );
  });

  it("shows chapter complete when every C++ 2 lesson passed", async () => {
    repositoryState.progressList = cppGrade2Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CppGrade2CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("C++ 2級 chapter progress")).toHaveTextContent("6 / 6 Lessons completed"));
    expect(screen.getByLabelText("C++ 2級 chapter progress")).toHaveTextContent("Completed");
  });
});
