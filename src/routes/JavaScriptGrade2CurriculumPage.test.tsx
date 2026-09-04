import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { javascriptGrade2Course } from "../content/javascript/grade-2";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { JavaScriptGrade2CurriculumPage } from "./JavaScriptGrade2CurriculumPage";

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
      <JavaScriptGrade2CurriculumPage />
    </MemoryRouter>
  );
}

describe("JavaScriptGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable JavaScript grade 2 lessons and progress", async () => {
    renderCurriculum();

    expect(await screen.findByText("0 / 6 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByLabelText("JavaScript 2級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: 関数の戻り値/ })).toHaveAttribute(
      "href",
      "/languages/javascript/grade-2/lessons/lesson_js2_01_function_return"
    );
  });

  it("shows chapter complete when every JavaScript 2 lesson passed", async () => {
    repositoryState.progressList = javascriptGrade2Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    renderCurriculum();

    expect(await screen.findByText("6 / 6 Lessons completed")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
