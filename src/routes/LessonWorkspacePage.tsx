import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findLessonById, findNextLesson } from "../content/catalog";
import type { AppSettings, LessonProgress } from "../domain/progress";
import { CodeEditor } from "../features/editor/CodeEditor";
import { GradingEngine, type GradeResult } from "../features/grading";
import { createAttempt, createGradeSummaryResult } from "../features/progress/attempts";
import { markPassed, createInitialProgress, touchProgress } from "../features/progress/progressModel";
import { PythonRunner, type RunResult } from "../features/runner";
import { defaultSettings, localUserId, progressRepository, settingsRepository } from "../repositories";

declare global {
  interface Window {
    __programmingTrainerSetEditorValue?: (value: string) => void;
    __programmingTrainerEditorValue?: string;
    __programmingTrainerLoadedLessonId?: string;
  }
}

export function LessonWorkspacePage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? findLessonById(lessonId) : undefined;
  const exercise = lesson?.exercises[0];
  const runnerRef = useRef<PythonRunner | undefined>(undefined);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [progress, setProgress] = useState<LessonProgress | undefined>();
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [visibleHintCount, setVisibleHintCount] = useState(0);
  const [runResult, setRunResult] = useState<RunResult | undefined>();
  const [gradeResult, setGradeResult] = useState<GradeResult | undefined>();
  const [runtimeState, setRuntimeState] = useState<"idle" | "initializing" | "running" | "grading">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    window.__programmingTrainerSetEditorValue = setCode;
    return () => {
      if (window.__programmingTrainerSetEditorValue === setCode) {
        delete window.__programmingTrainerSetEditorValue;
      }
      delete window.__programmingTrainerEditorValue;
      delete window.__programmingTrainerLoadedLessonId;
    };
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__programmingTrainerEditorValue = code;
    }
  }, [code]);

  useEffect(() => {
    runnerRef.current = new PythonRunner();
    return () => {
      void runnerRef.current?.dispose();
      runnerRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadLessonState() {
      if (!lesson) {
        return;
      }
      if (import.meta.env.DEV) {
        delete window.__programmingTrainerLoadedLessonId;
      }
      const [storedSettings, storedProgress] = await Promise.all([
        settingsRepository.getOrCreateSettings(localUserId),
        progressRepository.getLessonProgress(localUserId, lesson.id),
      ]);

      if (!active) {
        return;
      }

      const nextProgress = storedProgress ?? createInitialProgress(localUserId, lesson.id, lesson.starterCode);
      setSettings(storedSettings);
      setProgress(nextProgress);
      setCode(nextProgress.lastCode || lesson.starterCode);
      setVisibleHintCount(Math.min(nextProgress.hintCount, lesson.hints.length));
      setRunResult(undefined);
      setGradeResult(undefined);
      setStdin(lesson.sampleInput);
      setErrorMessage("");
      if (import.meta.env.DEV) {
        window.__programmingTrainerLoadedLessonId = lesson.id;
      }
    }

    void loadLessonState();

    return () => {
      active = false;
    };
  }, [lesson]);

  const persistProgress = useCallback(async (nextProgress: LessonProgress) => {
    setProgress(nextProgress);
    await progressRepository.saveLessonProgress(nextProgress);
  }, []);

  const handleCodeChange = useCallback((nextCode: string) => {
    setCode(nextCode);
    if (!lesson || !progress) {
      return;
    }
    void persistProgress(touchProgress(progress, {
      status: progress.status === "passed" ? "passed" : "in_progress",
      lastCode: nextCode,
    }));
  }, [lesson, persistProgress, progress]);

  const canRun = Boolean(lesson && exercise && code.trim().length > 0 && runtimeState === "idle");

  const runCurrentCode = useCallback(async () => {
    if (!lesson || !exercise || !progress || !runnerRef.current) {
      return;
    }

    setRuntimeState("initializing");
    setErrorMessage("");
    setGradeResult(undefined);

    try {
      await runnerRef.current.initialize();
      setRuntimeState("running");
      const result = await runnerRef.current.run({ sourceCode: code, stdin, timeoutMs: exercise.timeoutMs });
      setRunResult(result);
      const nextProgress = touchProgress(progress, {
        status: progress.status === "passed" ? "passed" : "in_progress",
        lastCode: code,
        runCount: progress.runCount + 1,
      });
      await persistProgress(nextProgress);
      await progressRepository.recordAttempt(createAttempt(lesson.id, exercise.id, code, stdin, result, false));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRuntimeState("idle");
    }
  }, [code, exercise, lesson, persistProgress, progress, stdin]);

  const gradeCurrentCode = useCallback(async () => {
    if (!lesson || !exercise || !progress || !runnerRef.current) {
      return;
    }

    setRuntimeState("initializing");
    setErrorMessage("");

    try {
      await runnerRef.current.initialize();
      setRuntimeState("grading");
      const grade = await new GradingEngine(runnerRef.current).gradeExercise(exercise, code);
      const summaryResult = createGradeSummaryResult(grade);
      const baseProgress = touchProgress(progress, {
        status: progress.status === "passed" ? "passed" : "in_progress",
        lastCode: code,
        gradeCount: progress.gradeCount + 1,
      });
      const nextProgress = grade.passed ? markPassed(baseProgress) : baseProgress;
      await persistProgress(nextProgress);
      await progressRepository.recordAttempt(createAttempt(lesson.id, exercise.id, code, "", summaryResult, grade.passed, grade));
      setGradeResult(grade);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRuntimeState("idle");
    }
  }, [code, exercise, lesson, persistProgress, progress]);

  const revealHint = useCallback(async () => {
    if (!lesson || !progress) {
      return;
    }
    const nextHintCount = Math.min(visibleHintCount + 1, lesson.hints.length);
    setVisibleHintCount(nextHintCount);
    await persistProgress(touchProgress(progress, {
      hintCount: Math.max(progress.hintCount, nextHintCount),
      lastCode: code,
      status: progress.status === "passed" ? "passed" : "in_progress",
    }));
  }, [code, lesson, persistProgress, progress, visibleHintCount]);

  const resetCode = useCallback(async () => {
    if (!lesson || !progress) {
      return;
    }
    setCode(lesson.starterCode);
    setRunResult(undefined);
    setGradeResult(undefined);
    await persistProgress(touchProgress(progress, { lastCode: lesson.starterCode }));
  }, [lesson, persistProgress, progress]);

  const nextLesson = useMemo(() => (lesson ? findNextLesson(lesson.id) : undefined), [lesson]);

  if (!lesson) {
    return (
      <section className="page-panel">
        <h1>Lesson not found</h1>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  if (!exercise) {
    return (
      <section className="page-panel">
        <h1>{lesson.title}</h1>
        <p>このLessonは準備中です。</p>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  const passed = progress?.status === "passed" || gradeResult?.passed === true;

  return (
    <section className="workspace-shell" aria-label="Lesson Workspace">
      <aside className="lesson-pane">
        <p className="eyebrow">SCR-040</p>
        <div className="lesson-title-row">
          <h1>{lesson.title}</h1>
          <StatusBadge status={passed ? "passed" : lesson.status} />
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
          <h2>入力例</h2>
          <pre>{lesson.sampleInput || "なし"}</pre>
        </section>
        <section>
          <h2>出力例</h2>
          <pre>{lesson.sampleOutput}</pre>
        </section>
        <section>
          <h2>制約</h2>
          <ul>
            {lesson.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>ヒント</h2>
          <button className="small-button" type="button" onClick={revealHint} disabled={visibleHintCount >= lesson.hints.length}>
            ヒント
          </button>
          <ol className="hint-list">
            {lesson.hints.slice(0, visibleHintCount).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        </section>
      </aside>
      <div className="editor-pane">
        <div className="editor-toolbar">
          <span>Python</span>
          <span className="runtime-state">{runtimeState === "idle" ? "ready" : runtimeState}</span>
          <button type="button" onClick={runCurrentCode} disabled={!canRun}>
            実行
          </button>
          <button type="button" onClick={gradeCurrentCode} disabled={!canRun}>
            採点
          </button>
          <button type="button" onClick={resetCode} disabled={runtimeState !== "idle"}>
            リセット
          </button>
        </div>
        <div className="monaco-host">
          <CodeEditor value={code} fontSize={settings.editorFontSize} tabSize={settings.tabSize} onChange={handleCodeChange} />
        </div>
        <div className="console-pane" aria-label="Console">
          <div className="stdin-area">
            <label htmlFor="stdin">stdin</label>
            <textarea id="stdin" value={stdin} onChange={(event) => setStdin(event.target.value)} />
          </div>
          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
          <div className="output-grid">
            <section>
              <h2>stdout</h2>
              <pre aria-label="stdout">{runResult?.stdout ?? ""}</pre>
            </section>
            <section>
              <h2>stderr</h2>
              <pre aria-label="stderr">{runResult?.stderr ?? ""}</pre>
            </section>
          </div>
          {gradeResult ? (
            <section className="grade-panel" aria-label="Grading result">
              <div className={gradeResult.passed ? "pass-banner" : "fail-banner"}>
                {gradeResult.passed ? "合格" : "未合格"} ({gradeResult.passedRequired}/{gradeResult.totalRequired})
              </div>
              <div className="test-result-list">
                {gradeResult.results.map((result) => (
                  <article key={result.testCaseId} className="test-result-row">
                    <strong>{result.visibility === "hidden" ? "Hidden Test" : "Public Test"} #{result.order}: {result.passed ? "pass" : "fail"}</strong>
                    {result.visibility === "public" ? (
                      <div className="test-detail">
                        <span>input</span>
                        <pre>{result.stdin || "なし"}</pre>
                        <span>expected</span>
                        <pre>{result.expectedStdout}</pre>
                        <span>actual</span>
                        <pre>{result.actualStdout || result.stderr}</pre>
                      </div>
                    ) : (
                      <p>非公開テストのため詳細は表示されません。</p>
                    )}
                  </article>
                ))}
              </div>
              {gradeResult.passed ? (
                <div className="completion-actions">
                  <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
                    Curriculumへ戻る
                  </Link>
                  {nextLesson ? (
                    <Link className="primary-action inline-action" to={routePaths.pythonGrade3Lesson(nextLesson.id)}>
                      次Lessonへ進む
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}


