import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findCourseByLessonId, findLessonById, findNextLesson } from "../content/catalog";
import { CodeEditor } from "../features/editor/CodeEditor";
import { explainTestCaseResult, type GradeResult } from "../features/grading";
import { gradeHtmlCssExercise } from "../features/htmlCss/htmlCssGrading";
import { buildHtmlCssPreviewDocument, getHtmlCssStarterFiles, parseHtmlCssFiles, serializeHtmlCssFiles, type HtmlCssFiles } from "../features/htmlCss/htmlCssProject";
import { createAttempt, createGradeSummaryResult } from "../features/progress/attempts";
import { createInitialProgress, markPassed, touchProgress } from "../features/progress/progressModel";
import { localUserId, progressRepository } from "../repositories";

declare global {
  interface Window {
    __programmingTrainerLoadedHtmlCssLessonId?: string;
    __programmingTrainerSetHtmlCssFileValue?: (path: keyof HtmlCssFiles, value: string) => void;
    __programmingTrainerHtmlCssFiles?: HtmlCssFiles;
  }
}

const htmlCssRouteByLevelId: Record<string, { curriculum: string; lesson: (lessonId: string) => string }> = {
  level_html_css_1: { curriculum: routePaths.htmlCssGrade1, lesson: routePaths.htmlCssGrade1Lesson },
  level_html_css_2: { curriculum: routePaths.htmlCssGrade2, lesson: routePaths.htmlCssGrade2Lesson },
  level_html_css_3: { curriculum: routePaths.htmlCssGrade3, lesson: routePaths.htmlCssGrade3Lesson },
};

export function HtmlCssWorkspacePage() {
  const { lessonId } = useParams();
  const lesson = useMemo(() => lessonId ? findLessonById(lessonId) : undefined, [lessonId]);
  const course = useMemo(() => lessonId ? findCourseByLessonId(lessonId) : undefined, [lessonId]);
  const routeConfig = course ? htmlCssRouteByLevelId[course.levelId] : undefined;
  const curriculumPath = routeConfig?.curriculum ?? routePaths.htmlCssGrade3;
  const nextLesson = useMemo(() => lessonId ? findNextLesson(lessonId) : undefined, [lessonId]);
  const exercise = lesson?.exercises[0];
  const starterFiles = useMemo(() => {
    const currentLesson = lessonId ? findLessonById(lessonId) : undefined;
    const currentExercise = currentLesson?.exercises[0];
    return currentExercise ? getHtmlCssStarterFiles(currentExercise) : { html: "", css: "" };
  }, [lessonId]);
  const [files, setFiles] = useState<HtmlCssFiles>(starterFiles);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "passed">("not_started");
  const [gradeResult, setGradeResult] = useState<GradeResult | undefined>();
  const [isGrading, setIsGrading] = useState(false);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const previewDocument = useMemo(() => buildHtmlCssPreviewDocument(files), [files]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__programmingTrainerHtmlCssFiles = files;
    }
  }, [files]);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!lesson || !exercise) {
        return;
      }
      if (import.meta.env.DEV) {
        delete window.__programmingTrainerLoadedHtmlCssLessonId;
      }
      setIsProgressLoaded(false);
      const storedProgress = await progressRepository.getLessonProgress(localUserId, lesson.id);
      if (!active) {
        return;
      }
      const nextProgress = storedProgress ?? createInitialProgress(localUserId, lesson.id, serializeHtmlCssFiles(starterFiles));
      setFiles(parseHtmlCssFiles(nextProgress.lastCode, starterFiles));
      setStatus(nextProgress.status);
      setGradeResult(undefined);
      setErrorMessage("");
      setIsProgressLoaded(true);
      if (import.meta.env.DEV) {
        window.__programmingTrainerLoadedHtmlCssLessonId = lesson.id;
      }
    }

    void loadProgress();

    return () => {
      active = false;
    };
  }, [exercise, lesson, starterFiles]);

  const persistFiles = useCallback(async (nextFiles: HtmlCssFiles) => {
    if (!lesson) {
      return;
    }
    const storedProgress = await progressRepository.getLessonProgress(localUserId, lesson.id);
    const baseProgress = storedProgress ?? createInitialProgress(localUserId, lesson.id, serializeHtmlCssFiles(starterFiles));
    const nextProgress = touchProgress(baseProgress, {
      lastCode: serializeHtmlCssFiles(nextFiles),
      status: baseProgress.status === "passed" ? "passed" : "in_progress",
    });
    setStatus(nextProgress.status);
    await progressRepository.saveLessonProgress(nextProgress);
  }, [lesson, starterFiles]);

  function updateFile(path: keyof HtmlCssFiles, value: string) {
    const nextFiles = { ...files, [path]: value };
    setFiles(nextFiles);
    setGradeResult(undefined);
    void persistFiles(nextFiles);
  }

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    if (lesson && isProgressLoaded) {
      window.__programmingTrainerLoadedHtmlCssLessonId = lesson.id;
    }
    const setHtmlCssFileValue = (path: keyof HtmlCssFiles, value: string) => {
      setFiles((current) => {
        const nextFiles = { ...current, [path]: value };
        window.__programmingTrainerHtmlCssFiles = nextFiles;
        setGradeResult(undefined);
        void persistFiles(nextFiles);
        return nextFiles;
      });
    };
    window.__programmingTrainerSetHtmlCssFileValue = setHtmlCssFileValue;
    return () => {
      if (window.__programmingTrainerSetHtmlCssFileValue === setHtmlCssFileValue) {
        delete window.__programmingTrainerSetHtmlCssFileValue;
      }
      delete window.__programmingTrainerLoadedHtmlCssLessonId;
    };
  }, [isProgressLoaded, lesson, persistFiles]);

  function resetFiles() {
    setFiles(starterFiles);
    setGradeResult(undefined);
    void persistFiles(starterFiles);
  }

  async function gradeCurrentFiles() {
    if (!lesson || !exercise) {
      return;
    }

    setIsGrading(true);
    setErrorMessage("");

    try {
      const grade = gradeHtmlCssExercise(exercise, files);
      const storedProgress = await progressRepository.getLessonProgress(localUserId, lesson.id);
      const baseProgress = storedProgress ?? createInitialProgress(localUserId, lesson.id, serializeHtmlCssFiles(starterFiles));
      const touchedProgress = touchProgress(baseProgress, {
        lastCode: serializeHtmlCssFiles(files),
        status: grade.passed ? "passed" : (baseProgress.status === "passed" ? "passed" : "in_progress"),
        gradeCount: baseProgress.gradeCount + 1,
      });
      const nextProgress = grade.passed ? markPassed(touchedProgress) : touchedProgress;
      const summaryResult = createGradeSummaryResult(grade);

      setGradeResult(grade);
      setStatus(nextProgress.status);
      await progressRepository.saveLessonProgress(nextProgress);
      await progressRepository.recordAttempt(createAttempt(lesson.id, exercise.id, serializeHtmlCssFiles(files), "", summaryResult, grade.passed, grade));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsGrading(false);
    }
  }

  if (!lesson || !exercise) {
    return (
      <section className="page-panel">
        <h1>Lesson not found</h1>
        <Link className="secondary-action inline-action" to={routePaths.htmlCss}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="html-css-workspace" aria-label="HTML/CSS Workspace">
      <aside className="lesson-pane">
        <p className="eyebrow">SCR-040</p>
        <div className="lesson-title-row">
          <h1>{lesson.title}</h1>
          <StatusBadge status={status} />
        </div>
        <dl className="lesson-meta">
          <div>
            <dt>目標</dt>
            <dd>{lesson.objective}</dd>
          </div>
          <div>
            <dt>難易度</dt>
            <dd>{lesson.difficulty}</dd>
          </div>
          <div>
            <dt>想定時間</dt>
            <dd>{lesson.estimatedMinutes}分</dd>
          </div>
        </dl>
        <section>
          <h2>説明</h2>
          <p>{lesson.explanationMd}</p>
        </section>
        <section>
          <h2>課題</h2>
          <p>{lesson.taskMd}</p>
        </section>
        <section>
          <h2>制約</h2>
          <ul>
            {lesson.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>
        <div className="completion-actions">
          <Link className="secondary-action inline-action" to={curriculumPath}>
            Curriculumへ戻る
          </Link>
        </div>
      </aside>
      <div className="html-css-editor-pane">
        <div className="editor-toolbar">
          <span>HTML/CSS Preview</span>
          <span className="runtime-state">{isGrading ? "grading" : "sandboxed iframe"}</span>
          <button type="button" onClick={gradeCurrentFiles} disabled={isGrading}>
            採点
          </button>
          <button type="button" onClick={resetFiles}>
            リセット
          </button>
        </div>
        <div className="split-editor-grid">
          <section className="split-editor-panel" aria-label="index.html editor">
            <div className="split-editor-heading">index.html</div>
            <CodeEditor value={files.html} language="html" ariaLabel="HTML code editor" fontSize={14} tabSize={2} onChange={(value) => updateFile("html", value)} />
          </section>
          <section className="split-editor-panel" aria-label="styles.css editor">
            <div className="split-editor-heading">styles.css</div>
            <CodeEditor value={files.css} language="css" ariaLabel="CSS code editor" fontSize={14} tabSize={2} onChange={(value) => updateFile("css", value)} />
          </section>
        </div>
        <section className="preview-pane" aria-label="Live preview">
          <div className="preview-heading">Preview</div>
          <iframe title="HTML/CSS Preview" sandbox="" srcDoc={previewDocument} />
        </section>
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        {gradeResult ? (
          <section className="grade-panel html-css-grade-panel" aria-label="Grading result">
            <div className={gradeResult.passed ? "pass-banner" : "fail-banner"}>
              {gradeResult.passed ? "合格" : "未合格"} ({gradeResult.passedRequired}/{gradeResult.totalRequired})
            </div>
            {gradeResult.passed && nextLesson && routeConfig ? (
              <div className="completion-actions">
                <Link className="primary-action inline-action" to={routeConfig.lesson(nextLesson.id)}>
                  次のLessonへ進む
                </Link>
              </div>
            ) : null}
            <div className="test-result-list">
              {gradeResult.results.map((result) => (
                <article key={result.testCaseId} className="test-result-row">
                  <strong>
                    {result.visibility === "hidden" ? "Hidden Test" : "Public Test"} #{result.order}: {result.passed ? "pass" : "fail"}
                  </strong>
                  <p className="test-explanation">{explainTestCaseResult(result)}</p>
                  {result.visibility === "public" ? (
                    <div className="test-detail">
                      <span>condition</span>
                      <pre>{result.expectedStdout}</pre>
                      <span>actual</span>
                      <pre>{result.actualStdout || "一致する要素なし"}</pre>
                    </div>
                  ) : (
                    <p>非公開テストのため詳細は表示されません。</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
