import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commandGrade3Course } from "../content/command/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { CommandGrade3CurriculumPage } from "./CommandGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("CommandGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Command grade 3 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <CommandGrade3CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Command 3級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Command 3級 chapter progress")).toHaveTextContent("0 / 10 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: create files/ })).toHaveAttribute(
      "href",
      "/languages/command/grade-3/lessons/lesson_command3_01_create_files"
    );
    expect(screen.getByRole("link", { name: /Lesson 10: file workflow/ })).toHaveAttribute(
      "href",
      "/languages/command/grade-3/lessons/lesson_command3_10_file_workflow"
    );
  });

  it("shows chapter complete when every Command 3 lesson passed", async () => {
    repositoryState.progressList = commandGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <CommandGrade3CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Command 3級 chapter progress")).toHaveTextContent("10 / 10 Lessons completed"));
    expect(screen.getByLabelText("Command 3級 chapter progress")).toHaveTextContent("Completed");
  });
});
