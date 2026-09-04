import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "../domain/progress";
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

    expect(await screen.findByText("0 / 1 Lessons completed")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML/CSS 3級 chapter progress")).toHaveTextContent("Not started");
    expect(screen.getByRole("link", { name: /Lesson 01: split editor preview/ })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview"
    );
  });
});
