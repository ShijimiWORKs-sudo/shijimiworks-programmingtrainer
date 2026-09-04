import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { pythonGrade3Course } from "../content/python/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed, touchProgress } from "../features/progress/progressModel";
import { PythonGrade3CurriculumPage } from "./PythonGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
    listChallengeProgress: vi.fn(() => Promise.resolve([])),
  },
}));

function renderCurriculum() {
  render(
    <MemoryRouter>
      <PythonGrade3CurriculumPage />
    </MemoryRouter>
  );
}

describe("PythonGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows no completed lessons before learning starts", async () => {
    renderCurriculum();

    expect(await screen.findByText("0 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByLabelText("Python 3級 chapter progress")).toHaveTextContent("Not started");
  });

  it("shows chapter complete when every Python 3 lesson passed", async () => {
    repositoryState.progressList = pythonGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    renderCurriculum();

    expect(await screen.findByText("10 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("keeps completed lesson counts after a passed lesson is reopened and edited", async () => {
    const lesson = pythonGrade3Course.chapters[0].lessons[0];
    const passed = markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode));
    repositoryState.progressList = [touchProgress(passed, {
      lastCode: 'print("review")',
      status: passed.status === "passed" ? "passed" : "in_progress",
    })];

    renderCurriculum();

    expect(await screen.findByText("1 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
  });
});
