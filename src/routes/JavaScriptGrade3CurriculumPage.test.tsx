import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javascriptGrade3Course } from "../content/javascript/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaScriptGrade3CurriculumPage } from "./JavaScriptGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

function renderCurriculum() {
  render(
    <MemoryRouter>
      <JavaScriptGrade3CurriculumPage />
    </MemoryRouter>
  );
}

describe("JavaScriptGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows no completed lessons before learning starts", async () => {
    renderCurriculum();

    expect(await screen.findByText("0 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByLabelText("JavaScript 3級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: console.log/ })).toHaveAttribute(
      "href",
      "/languages/javascript/grade-3/lessons/lesson_js3_01_console_log"
    );
  });

  it("shows chapter complete when every JavaScript 3 lesson passed", async () => {
    repositoryState.progressList = javascriptGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    renderCurriculum();

    expect(await screen.findByText("10 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
