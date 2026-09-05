import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "../domain/progress";
import { createInitialProgress } from "../features/progress/progressModel";
import { serializeHtmlCssFiles } from "../features/htmlCss/htmlCssProject";
import { HtmlCssWorkspacePage } from "./HtmlCssWorkspacePage";

const repositoryState = vi.hoisted(() => ({
  progress: undefined as LessonProgress | undefined,
  saveLessonProgress: vi.fn(),
  recordAttempt: vi.fn(),
}));

vi.mock("../features/editor/CodeEditor", () => ({
  CodeEditor: ({ value, ariaLabel, onChange }: { value: string; ariaLabel: string; onChange(value: string): void }) => (
    <textarea aria-label={ariaLabel} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
  ),
}));

vi.mock("../repositories", () => ({
  localUserId: "local-user",
  progressRepository: {
    getLessonProgress: vi.fn(() => Promise.resolve(repositoryState.progress)),
    saveLessonProgress: repositoryState.saveLessonProgress,
    recordAttempt: repositoryState.recordAttempt,
  },
}));

function renderWorkspace(initialEntry = "/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/languages/html-css/grade-3/lessons/:lessonId" element={<HtmlCssWorkspacePage />} />
        <Route path="/languages/html-css/grade-2/lessons/:lessonId" element={<HtmlCssWorkspacePage />} />
        <Route path="/languages/html-css/grade-1/lessons/:lessonId" element={<HtmlCssWorkspacePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HtmlCssWorkspacePage", () => {
  beforeEach(() => {
    repositoryState.progress = undefined;
    repositoryState.saveLessonProgress.mockClear();
    repositoryState.recordAttempt.mockClear();
  });

  it("renders split HTML/CSS editors and a sandboxed preview", async () => {
    renderWorkspace();

    expect(await screen.findByRole("heading", { name: "Lesson 01: split editor preview" })).toBeInTheDocument();
    expect((screen.getByLabelText("HTML code editor") as HTMLTextAreaElement).value).toContain("<main");
    expect((screen.getByLabelText("CSS code editor") as HTMLTextAreaElement).value).toContain(".profile-card");
    expect(screen.getByTitle("HTML/CSS Preview")).toHaveAttribute("sandbox", "");
    expect(screen.getByTitle("HTML/CSS Preview")).toHaveAttribute("srcdoc", expect.stringContaining(".profile-card"));
  });

  it("updates preview and persists edited files", async () => {
    renderWorkspace();

    fireEvent.change(await screen.findByLabelText("HTML code editor"), { target: { value: "<h1>Changed</h1>" } });

    await waitFor(() => expect(repositoryState.saveLessonProgress).toHaveBeenCalled());
    expect(screen.getByTitle("HTML/CSS Preview")).toHaveAttribute("srcdoc", expect.stringContaining("<h1>Changed</h1>"));
  });

  it("restores serialized HTML/CSS progress", async () => {
    repositoryState.progress = createInitialProgress(
      "local-user",
      "lesson_htmlcss3_01_split_preview",
      serializeHtmlCssFiles({ html: "<h1>Saved</h1>", css: "h1 { color: purple; }" })
    );

    renderWorkspace();

    expect(await screen.findByLabelText("HTML code editor")).toHaveValue("<h1>Saved</h1>");
    expect(screen.getByLabelText("CSS code editor")).toHaveValue("h1 { color: purple; }");
  });

  it("grades DOM requirements and records progress without hidden details", async () => {
    renderWorkspace();

    fireEvent.click(await screen.findByRole("button", { name: "採点" }));

    expect(await screen.findByLabelText("Grading result")).toHaveTextContent("合格 (5/5)");
    expect(screen.getByRole("link", { name: "次のLessonへ進む" })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-3/lessons/lesson_htmlcss3_02_heading_paragraph"
    );
    expect(screen.getByText("Public Test #1: pass")).toBeInTheDocument();
    expect(screen.getByText("Hidden Test #3: pass")).toBeInTheDocument();
    expect(screen.getByText("Hidden Test #5: pass")).toBeInTheDocument();
    expect(screen.getAllByText("非公開テストのため詳細は表示されません。")).toHaveLength(2);
    await waitFor(() =>
      expect(repositoryState.saveLessonProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "passed",
          gradeCount: 1,
        })
      )
    );
    expect(repositoryState.recordAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonId: "lesson_htmlcss3_01_split_preview",
        exerciseId: "ex_htmlcss3_01_split_preview_01",
        passed: true,
        testResults: expect.arrayContaining([
          expect.objectContaining({ testCaseId: "dom:profile-card-description", passed: true }),
          expect.objectContaining({ testCaseId: "style:profile-card-responsive-padding", passed: true }),
        ]),
      })
    );
  });

  it("returns to the owning grade curriculum for grade 2 lessons", async () => {
    renderWorkspace("/languages/html-css/grade-2/lessons/lesson_htmlcss2_01_responsive_cards");

    expect(await screen.findByRole("heading", { name: "Lesson 01: responsive cards" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute(
      "href",
      "/languages/html-css/grade-2"
    );
  });
});
