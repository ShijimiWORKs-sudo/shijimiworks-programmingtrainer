import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javaGrade3Course } from "../content/java/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaGrade3CurriculumPage } from "./JavaGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("JavaGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Java grade 3 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <JavaGrade3CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Java 3級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Java 3級 chapter progress")).toHaveTextContent("0 / 10 Lessons completed");
    expect(screen.getByLabelText("Java 3級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: println/ })).toHaveAttribute(
      "href",
      "/languages/java/grade-3/lessons/lesson_java3_01_println"
    );
    expect(screen.getByRole("link", { name: /Lesson 10: メソッド/ })).toHaveAttribute(
      "href",
      "/languages/java/grade-3/lessons/lesson_java3_10_methods"
    );
  });

  it("shows chapter complete when every Java 3 lesson passed", async () => {
    repositoryState.progressList = javaGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <JavaGrade3CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Java 3級 chapter progress")).toHaveTextContent("10 / 10 Lessons completed"));
    expect(screen.getByLabelText("Java 3級 chapter progress")).toHaveTextContent("Completed");
  });
});
