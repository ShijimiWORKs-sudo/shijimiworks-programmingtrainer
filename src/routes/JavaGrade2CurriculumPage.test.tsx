import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javaGrade2Course } from "../content/java/grade-2";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaGrade2CurriculumPage } from "./JavaGrade2CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("JavaGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Java grade 2 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <JavaGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Java 2級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Java 2級 chapter progress")).toHaveTextContent("0 / 6 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: メソッドの戻り値/ })).toHaveAttribute(
      "href",
      "/languages/java/grade-2/lessons/lesson_java2_01_method_return"
    );
  });

  it("shows chapter complete when every Java 2 lesson passed", async () => {
    repositoryState.progressList = javaGrade2Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <JavaGrade2CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Java 2級 chapter progress")).toHaveTextContent("6 / 6 Lessons completed"));
    expect(screen.getByLabelText("Java 2級 chapter progress")).toHaveTextContent("Completed");
  });
});
