import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rubyGrade1Course } from "../content/ruby/grade-1";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { RubyGrade1CurriculumPage } from "./RubyGrade1CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("RubyGrade1CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Ruby grade 1 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <RubyGrade1CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Ruby 1級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Ruby 1級 chapter progress")).toHaveTextContent("0 / 4 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
      "href",
      "/languages/ruby/grade-1/lessons/lesson_ruby1_01_bug_fix"
    );
  });

  it("shows chapter complete when every Ruby 1 lesson passed", async () => {
    repositoryState.progressList = rubyGrade1Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <RubyGrade1CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Ruby 1級 chapter progress")).toHaveTextContent("4 / 4 Lessons completed"));
    expect(screen.getByLabelText("Ruby 1級 chapter progress")).toHaveTextContent("Completed");
  });
});
