import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rubyGrade3Course } from "../content/ruby/grade-3";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { RubyGrade3CurriculumPage } from "./RubyGrade3CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("RubyGrade3CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Ruby grade 3 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <RubyGrade3CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Ruby 3級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Ruby 3級 chapter progress")).toHaveTextContent("0 / 10 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: puts/ })).toHaveAttribute(
      "href",
      "/languages/ruby/grade-3/lessons/lesson_ruby3_01_puts"
    );
    expect(screen.getByRole("link", { name: /Lesson 10: メソッド/ })).toHaveAttribute(
      "href",
      "/languages/ruby/grade-3/lessons/lesson_ruby3_10_methods"
    );
  });

  it("shows chapter complete when every Ruby 3 lesson passed", async () => {
    repositoryState.progressList = rubyGrade3Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <RubyGrade3CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Ruby 3級 chapter progress")).toHaveTextContent("10 / 10 Lessons completed"));
    expect(screen.getByLabelText("Ruby 3級 chapter progress")).toHaveTextContent("Completed");
  });
});
