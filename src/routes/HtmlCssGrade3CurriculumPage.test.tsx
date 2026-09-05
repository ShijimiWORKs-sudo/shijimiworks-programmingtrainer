import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed, touchProgress } from "../features/progress/progressModel";
import { HtmlCssGrade3CurriculumPage } from "./HtmlCssGrade3CurriculumPage";

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
      <HtmlCssGrade3CurriculumPage />
    </MemoryRouter>
  );
}

describe("HtmlCssGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable HTML/CSS grade 3 preview lesson and progress", async () => {
    renderCurriculum();

    expect(await screen.findByText("0 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML/CSS 3級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: split editor preview/ })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview"
    );
    expect(screen.getByRole("link", { name: /Lesson 10: semantic landing/ })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-3/lessons/lesson_htmlcss3_10_semantic_landing"
    );
  });

  it("shows completed and in-progress chapter progress", async () => {
    repositoryState.progressList = [
      markPassed(createInitialProgress("local-user", "lesson_htmlcss3_01_split_preview", "")),
      touchProgress(createInitialProgress("local-user", "lesson_htmlcss3_02_heading_paragraph", ""), {
        status: "in_progress",
      }),
    ];

    renderCurriculum();

    expect(await screen.findByText("1 / 10 Lessons completed")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML/CSS 3級 chapter progress")).toHaveTextContent("10%");
    expect(screen.getByLabelText("HTML/CSS 3級 chapter progress")).toHaveTextContent("1 in progress");
  });
});
