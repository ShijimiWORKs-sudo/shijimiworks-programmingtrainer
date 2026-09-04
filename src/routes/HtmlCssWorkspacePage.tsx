import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findLessonById } from "../content/catalog";
import { CodeEditor } from "../features/editor/CodeEditor";
import { buildHtmlCssPreviewDocument, getHtmlCssStarterFiles, parseHtmlCssFiles, serializeHtmlCssFiles, type HtmlCssFiles } from "../features/htmlCss/htmlCssProject";
import { createInitialProgress, touchProgress } from "../features/progress/progressModel";
import { localUserId, progressRepository } from "../repositories";

declare global {
  interface Window {
    __programmingTrainerLoadedHtmlCssLessonId?: string;
    __programmingTrainerSetHtmlCssFileValue?: (path: keyof HtmlCssFiles, value: string) => void;
    __programmingTrainerHtmlCssFiles?: HtmlCssFiles;
  }
}

export function HtmlCssWorkspacePage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? findLessonById(lessonId) : undefined;
  const exercise = lesson?.exercises[0];
  const starterFiles = useMemo(() => exercise ? getHtmlCssStarterFiles(exercise) : { html: "", css: "" }, [exercise]);
  const [files, setFiles] = useState<HtmlCssFiles>(starterFiles);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "passed">("not_started");
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
      const storedProgress = await progressRepository.getLessonProgress(localUserId, lesson.id);
      if (!active) {
        return;
      }
      const nextProgress = storedProgress ?? createInitialProgress(localUserId, lesson.id, serializeHtmlCssFiles(starterFiles));
      setFiles(parseHtmlCssFiles(nextProgress.lastCode, starterFiles));
      setStatus(nextProgress.status);
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

  const updateFile = useCallback((path: keyof HtmlCssFiles, value: string) => {
    const nextFiles = { ...files, [path]: value };
    setFiles(nextFiles);
    void persistFiles(nextFiles);
  }, [files, persistFiles]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    window.__programmingTrainerSetHtmlCssFileValue = (path, value) => {
      setFiles((current) => {
        const nextFiles = { ...current, [path]: value };
        void persistFiles(nextFiles);
        return nextFiles;
      });
    };
    return () => {
      delete window.__programmingTrainerSetHtmlCssFileValue;
      delete window.__programmingTrainerHtmlCssFiles;
      delete window.__programmingTrainerLoadedHtmlCssLessonId;
    };
  }, [persistFiles]);

  const resetFiles = useCallback(() => {
    setFiles(starterFiles);
    void persistFiles(starterFiles);
  }, [persistFiles, starterFiles]);

  if (!lesson || !exercise) {
    return (
      <section className="page-panel">
        <h1>Lesson not found</h1>
        <Link className="secondary-action inline-action" to={routePaths.htmlCssGrade3}>
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
          <Link className="secondary-action inline-action" to={routePaths.htmlCssGrade3}>
            Curriculumへ戻る
          </Link>
        </div>
      </aside>
      <div className="html-css-editor-pane">
        <div className="editor-toolbar">
          <span>HTML/CSS Preview</span>
          <span className="runtime-state">sandboxed iframe</span>
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
      </div>
    </section>
  );
}
