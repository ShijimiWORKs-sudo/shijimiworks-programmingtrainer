import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findChallengeById } from "../content/catalog";
import type { AppSettings, ChallengeProgress } from "../domain/progress";
import { CodeEditor } from "../features/editor/CodeEditor";
import { explainTestCaseResult, GradingEngine, type GradeResult } from "../features/grading";
import {
  createInitialChallengeProgress,
  getChallengeExerciseProgress,
  touchChallengeExerciseProgress,
} from "../features/progress/progressModel";
import { PythonRunner, type RunResult } from "../features/runner";
import { defaultSettings, localUserId, progressRepository, settingsRepository } from "../repositories";

export function ChallengeWorkspacePage() {
  const { challengeId } = useParams();
  const challenge = challengeId ? findChallengeById(challengeId) : undefined;
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const exercise = useMemo(
    () => challenge?.exercises.find((candidate) => candidate.id === selectedExerciseId) ?? challenge?.exercises[0],
    [challenge, selectedExerciseId]
  );
  const runnerRef = useRef<PythonRunner | undefined>(undefined);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [progress, setProgress] = useState<ChallengeProgress | undefined>();
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
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

    async function loadChallengeState() {
      if (!challenge) {
        return;
      }
      if (import.meta.env.DEV) {
        delete window.__programmingTrainerLoadedLessonId;
      }

      const [storedSettings, storedProgress] = await Promise.all([
        settingsRepository.getOrCreateSettings(localUserId),
        progressRepository.getChallengeProgress(localUserId, challenge.id),
      ]);

      if (!active) {
        return;
      }

      const firstExercise = challenge.exercises[0];
      const nextProgress = storedProgress ?? createInitialChallengeProgress(localUserId, challenge.id);
      const nextExercise = challenge.exercises.find((candidate) => candidate.id === nextProgress.activeExerciseId) ?? firstExercise;
      setSettings(storedSettings);
      setProgress(nextProgress);
      setSelectedExerciseId(nextExercise?.id ?? "");
      setCode(nextExercise ? getChallengeExerciseProgress(nextProgress, nextExercise.id, nextExercise.starterCode).lastCode : "");
      setStdin(nextExercise?.testCases.find((testCase) => testCase.visibility === "public")?.stdin ?? "");
      setRunResult(undefined);
      setGradeResult(undefined);
      setErrorMessage("");
      if (import.meta.env.DEV) {
        window.__programmingTrainerLoadedLessonId = challenge.id;
      }
    }

    void loadChallengeState();

    return () => {
      active = false;
    };
  }, [challenge]);

  const persistProgress = useCallback(async (nextProgress: ChallengeProgress) => {
    setProgress(nextProgress);
    await progressRepository.saveChallengeProgress(nextProgress);
  }, []);

  const handleCodeChange = useCallback((nextCode: string) => {
    setCode(nextCode);
    if (!challenge || !exercise || !progress) {
      return;
    }
    const exerciseProgress = getChallengeExerciseProgress(progress, exercise.id, exercise.starterCode);
    void persistProgress(touchChallengeExerciseProgress(
      progress,
      exercise.id,
      exercise.starterCode,
      {
        status: exerciseProgress.status === "passed" ? "passed" : "in_progress",
        lastCode: nextCode,
      },
      { status: progress.status === "passed" ? "passed" : "in_progress" }
    ));
  }, [challenge, exercise, persistProgress, progress]);

  const canRun = Boolean(challenge && exercise && code.trim().length > 0 && runtimeState === "idle");

  const runCurrentCode = useCallback(async () => {
    if (!challenge || !exercise || !progress || !runnerRef.current) {
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
      const exerciseProgress = getChallengeExerciseProgress(progress, exercise.id, exercise.starterCode);
      const nextProgress = touchChallengeExerciseProgress(progress, exercise.id, exercise.starterCode, {
        status: exerciseProgress.status === "passed" ? "passed" : "in_progress",
        lastCode: code,
        runCount: exerciseProgress.runCount + 1,
      }, {
        status: progress.status === "passed" ? "passed" : "in_progress",
        runCount: progress.runCount + 1,
      });
      await persistProgress(nextProgress);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRuntimeState("idle");
    }
  }, [challenge, code, exercise, persistProgress, progress, stdin]);

  const gradeCurrentCode = useCallback(async () => {
    if (!challenge || !exercise || !progress || !runnerRef.current) {
      return;
    }

    setRuntimeState("initializing");
    setErrorMessage("");

    try {
      await runnerRef.current.initialize();
      setRuntimeState("grading");
      const grade = await new GradingEngine(runnerRef.current).gradeExercise(exercise, code);
      const exerciseProgress = getChallengeExerciseProgress(progress, exercise.id, exercise.starterCode);
      const nextProgress = touchChallengeExerciseProgress(progress, exercise.id, exercise.starterCode, {
        status: grade.passed ? "passed" : (exerciseProgress.status === "passed" ? "passed" : "in_progress"),
        lastCode: code,
        gradeCount: exerciseProgress.gradeCount + 1,
      }, {
        status: grade.passed ? "passed" : (progress.status === "passed" ? "passed" : "in_progress"),
        gradeCount: progress.gradeCount + 1,
        passedRequiredCount: grade.passedRequired,
        totalRequiredCount: grade.totalRequired,
      });
      await persistProgress(nextProgress);
      setGradeResult(grade);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRuntimeState("idle");
    }
  }, [challenge, code, exercise, persistProgress, progress]);

  if (!challenge) {
    return (
      <section className="page-panel">
        <h1>Challenge not found</h1>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  if (!exercise) {
    return (
      <section className="page-panel">
        <h1>{challenge.title}</h1>
        <p>このChallengeは準備中です。</p>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  const passed = progress?.status === "passed" || gradeResult?.passed === true;

  return (
    <section className="workspace-shell" aria-label="Challenge Workspace">
      <aside className="lesson-pane">
        <p className="eyebrow">SCR-050</p>
        <div className="lesson-title-row">
          <h1>{challenge.title}</h1>
          <StatusBadge status={passed ? "passed" : challenge.status} />
        </div>
        <dl className="lesson-meta">
          <div>
            <dt>目標</dt>
            <dd>{challenge.objective}</dd>
          </div>
          <div>
            <dt>想定時間</dt>
            <dd>{challenge.estimatedMinutes}分</dd>
          </div>
          <div>
            <dt>合格条件</dt>
            <dd>{challenge.passingRequiredCount} required tests</dd>
          </div>
        </dl>
        <section>
          <h2>説明</h2>
          <p>{challenge.descriptionMd}</p>
        </section>
        <section>
          <h2>課題</h2>
          <p>{challenge.instructionsMd}</p>
        </section>
        <section>
          <h2>入力例</h2>
          <pre>{exercise.testCases.find((testCase) => testCase.visibility === "public")?.stdin ?? "なし"}</pre>
        </section>
        <section>
          <h2>関連Lesson</h2>
          <p>{challenge.sourceLessonIds.length} Lessons</p>
        </section>
      </aside>
      <div className="editor-pane">
        <div className="editor-toolbar">
          <span>Python Challenge</span>
          <span className="runtime-state">{runtimeState === "idle" ? "ready" : runtimeState}</span>
          <button type="button" onClick={runCurrentCode} disabled={!canRun}>
            実行
          </button>
          <button type="button" onClick={gradeCurrentCode} disabled={!canRun}>
            採点
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
                {gradeResult.passed ? "Challenge Passed" : "未合格"} ({gradeResult.passedRequired}/{gradeResult.totalRequired})
              </div>
              <div className="test-result-list">
                {gradeResult.results.map((result) => (
                  <article key={result.testCaseId} className="test-result-row">
                    <strong>{result.visibility === "hidden" ? "Hidden Test" : "Public Test"} #{result.order}: {result.passed ? "pass" : "fail"}</strong>
                    <p className="test-explanation">{explainTestCaseResult(result)}</p>
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
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
