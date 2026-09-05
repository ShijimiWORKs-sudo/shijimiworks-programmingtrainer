import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commandGrade1Course } from "../content/command/grade-1";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CommandGrade1CurriculumPage } from "./CommandGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CommandGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Command grade 1 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CommandGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Command 1級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Command 1級 chapter progress")).toHaveTextContent("0 / 4 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix cleanup/ })).toHaveAttribute(
      "href",
      "/languages/command/grade-1/lessons/lesson_command1_01_bug_fix_cleanup"
    );
  });

  it("shows chapter complete when every Command 1 lesson passed", async () => {
    repositoryState.progressList = commandGrade1Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CommandGrade1CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Command 1級 chapter progress")).toHaveTextContent("4 / 4 Lessons completed"));
    expect(screen.getByLabelText("Command 1級 chapter progress")).toHaveTextContent("Completed");
  });
});
