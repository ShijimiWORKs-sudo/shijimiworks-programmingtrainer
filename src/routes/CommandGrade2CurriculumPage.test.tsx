import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commandGrade2Course } from "../content/command/grade-2";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CommandGrade2CurriculumPage } from "./CommandGrade2CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CommandGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Command grade 2 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CommandGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Command 2級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Command 2級 chapter progress")).toHaveTextContent("0 / 6 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: backup workflow/ })).toHaveAttribute(
      "href",
      "/languages/command/grade-2/lessons/lesson_command2_01_backup_workflow"
    );
  });

  it("shows chapter complete when every Command 2 lesson passed", async () => {
    repositoryState.progressList = commandGrade2Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CommandGrade2CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Command 2級 chapter progress")).toHaveTextContent("6 / 6 Lessons completed"));
    expect(screen.getByLabelText("Command 2級 chapter progress")).toHaveTextContent("Completed");
  });
});
