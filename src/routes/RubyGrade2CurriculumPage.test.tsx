import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rubyGrade2Course } from "../content/ruby/grade-2";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress, markPassed } from "../features/progress/progressModel";
import { RubyGrade2CurriculumPage } from "./RubyGrade2CurriculumPage";

const repositoryState = vi.hoisted(() => ({
  progressList: [] as LessonProgress[],
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    listLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progressList)),
  },
}));

describe("RubyGrade2CurriculumPage", () => {
  beforeEach(() => {
    repositoryState.progressList = [];
  });

  it("shows routeable Ruby grade 2 lessons and progress", async () => {
    render(
      <MemoryRouter>
        <RubyGrade2CurriculumPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Ruby 2級" })).toBeInTheDocument();
    expect(screen.getByLabelText("Ruby 2級 chapter progress")).toHaveTextContent("0 / 6 Lessons completed");
    expect(screen.getByRole("link", { name: /Lesson 01: メソッドの戻り値/ })).toHaveAttribute(
      "href",
      "/languages/ruby/grade-2/lessons/lesson_ruby2_01_method_return"
    );
  });

  it("shows chapter complete when every Ruby 2 lesson passed", async () => {
    repositoryState.progressList = rubyGrade2Course.chapters[0].lessons.map((lesson) =>
      markPassed(createInitialProgress("local-user", lesson.id, lesson.starterCode))
    );

    render(
      <MemoryRouter>
        <RubyGrade2CurriculumPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText("Ruby 2級 chapter progress")).toHaveTextContent("6 / 6 Lessons completed"));
    expect(screen.getByLabelText("Ruby 2級 chapter progress")).toHaveTextContent("Completed");
  });
});
