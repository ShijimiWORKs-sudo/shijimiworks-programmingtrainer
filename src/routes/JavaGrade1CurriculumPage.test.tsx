import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javaGrade1Course } from "../content/java/grade-1";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaGrade1CurriculumPage } from "./JavaGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("JavaGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Java grade 1 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <JavaGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Java 1級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Java 1級 chapter progress")).toHaveTextContent("0 / 4 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
      "href",
      "/languages/java/grade-1/lessons/lesson_java1_01_bug_fix"
    );
  });

  it("shows chapter complete when every Java 1 lesson passed", async () => {
    repositoryState.progressList = javaGrade1Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <JavaGrade1CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Java 1級 chapter progress")).toHaveTextContent("4 / 4 Lessons completed"));
    expect(screen.getByLabelText("Java 1級 chapter progress")).toHaveTextContent("Completed");
  });
});
