import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { HtmlCssGrade2CurriculumPage } from "./HtmlCssGrade2CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("HtmlCssGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable HTML/CSS grade 2 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <HtmlCssGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("0 / 6 Lessons completed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lesson 01: responsive cards/ })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-2/lessons/lesson_htmlcss2_01_responsive_cards"
    );
  });

  it("summarizes passed grade 2 lessons", async () => {
    repositoryState.progressList = [
      markPassed(createInitialProgress("local-user", "lesson_htmlcss2_01_responsive_cards", "")),
    ];

    render(
      <MemoryRouter>
        <HtmlCssGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("1 / 6 Lessons completed")).toBeInTheDocument();
    expect(screen.getByLabelText("HTML/CSS 2級 chapter progress")).toHaveTextContent("17%");
  });
});
