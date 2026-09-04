import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findMockExamById } from "../content/catalog";
import type { AppSettings, MockExamSession } from "../domain/progress";
import { CodeEditor } from "../features/editor/CodeEditor";
import {
  createInitialMockExamSession,
  getMockExamAnswer,
  saveMockExamAnswer,
  touchMockExamSession,
} from "../features/progress/progressModel";
import { defaultSettings, localUserId, progressRepository, settingsRepository } from "../repositories";

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function MockExamShellPage() {
  const { examId } = useParams();
  const exam = examId ? findMockExamById(examId) : undefined;
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [session, setSession] = useState<MockExamSession | undefined>();
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const saveTimerRef = useRef<number | undefined>(undefined);
  const problem = useMemo(
    () => exam?.problems.find((candidate) => candidate.id === session?.activeProblemId) ?? exam?.problems[0],
    [exam, session?.activeProblemId]
  );

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
    let active = true;

    async function loadExamState() {
      if (!exam) {
        return;
      }

      const firstProblem = exam.problems[0];
      if (import.meta.env.DEV) {
        delete window.__programmingTrainerLoadedLessonId;
      }

      const [storedSettings, storedSession] = await Promise.all([
        settingsRepository.getOrCreateSettings(localUserId),
        progressRepository.getMockExamSession(localUserId, exam.id),
      ]);

      if (!active) {
        return;
      }

      const nextSession = storedSession ?? createInitialMockExamSession(
        localUserId,
        exam.id,
        firstProblem.id,
        firstProblem.starterCode,
        exam.timeLimitMinutes
      );
      const nextProblem = exam.problems.find((candidate) => candidate.id === nextSession.activeProblemId) ?? firstProblem;
      setSettings(storedSettings);
      setSession(nextSession);
      setRemainingSeconds(nextSession.remainingSeconds);
      setCode(getMockExamAnswer(nextSession, nextProblem.id, nextProblem.starterCode).sourceCode);
      if (import.meta.env.DEV) {
        window.__programmingTrainerLoadedLessonId = exam.id;
      }
    }

    void loadExamState();

    return () => {
      active = false;
    };
  }, [exam]);

  useEffect(() => {
    if (session?.status !== "in_progress") {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session?.status]);

  const persistSession = useCallback(async (nextSession: MockExamSession) => {
    setSession(nextSession);
    setRemainingSeconds(nextSession.remainingSeconds);
    await progressRepository.saveMockExamSession(nextSession);
  }, []);

  const persistAnswer = useCallback((sourceCode: string) => {
    if (!session || !problem) {
      return;
    }
    const nextSession = saveMockExamAnswer(session, problem.id, sourceCode);
    setSession(nextSession);
    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      void progressRepository.saveMockExamSession(nextSession);
    }, 150);
  }, [problem, session]);

  const handleCodeChange = useCallback((nextCode: string) => {
    setCode(nextCode);
    persistAnswer(nextCode);
  }, [persistAnswer]);

  const startExam = useCallback(async () => {
    if (!exam || !problem || !session) {
      return;
    }

    await persistSession(touchMockExamSession(session, {
      status: "in_progress",
      activeProblemId: problem.id,
      remainingSeconds,
      startedAt: session.startedAt ?? new Date().toISOString(),
    }));
  }, [exam, persistSession, problem, remainingSeconds, session]);

  const pauseExam = useCallback(async () => {
    if (!session) {
      return;
    }

    await persistSession(touchMockExamSession(saveMockExamAnswer(session, session.activeProblemId, code), {
      status: "paused",
      pausedAt: new Date().toISOString(),
      remainingSeconds,
    }));
  }, [code, persistSession, remainingSeconds, session]);

  const resumeExam = useCallback(async () => {
    if (!session) {
      return;
    }

    await persistSession(touchMockExamSession(session, {
      status: "in_progress",
      remainingSeconds,
    }));
  }, [persistSession, remainingSeconds, session]);

  const selectProblem = useCallback(async (problemId: string) => {
    if (!exam || !session || !problem || problem.id === problemId) {
      return;
    }

    const nextProblem = exam.problems.find((candidate) => candidate.id === problemId);
    if (!nextProblem) {
      return;
    }

    const saved = saveMockExamAnswer(session, problem.id, code);
    const nextSession = touchMockExamSession(saved, {
      activeProblemId: nextProblem.id,
      remainingSeconds,
    });
    await persistSession(nextSession);
    setCode(getMockExamAnswer(nextSession, nextProblem.id, nextProblem.starterCode).sourceCode);
  }, [code, exam, persistSession, problem, remainingSeconds, session]);

  if (!exam) {
    return (
      <section className="page-panel">
        <h1>Mock exam not found</h1>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  if (!problem || !session) {
    return (
      <section className="page-panel">
        <h1>{exam.title}</h1>
        <p>模擬試験を読み込み中です。</p>
      </section>
    );
  }

  const activeProblemIndex = exam.problems.findIndex((candidate) => candidate.id === problem.id);
  const hasStarted = session.status !== "not_started";

  return (
    <section className="workspace-shell" aria-label="Mock Exam Shell">
      <aside className="lesson-pane">
        <p className="eyebrow">SCR-060</p>
        <div className="lesson-title-row">
          <h1>{exam.title}</h1>
          <StatusBadge status={session.status} />
        </div>
        <dl className="lesson-meta">
          <div>
            <dt>残り時間</dt>
            <dd className="exam-timer" aria-label="Remaining time">{formatRemaining(remainingSeconds)}</dd>
          </div>
          <div>
            <dt>問題</dt>
            <dd>{activeProblemIndex + 1} / {exam.problems.length}</dd>
          </div>
        </dl>
        <section>
          <h2>説明</h2>
          <p>{exam.descriptionMd}</p>
        </section>
        <section aria-label="Exam problems">
          <h2>Problems</h2>
          <div className="exam-problem-nav">
            {exam.problems.map((candidate, index) => (
              <button
                key={candidate.id}
                className={candidate.id === problem.id ? "exercise-tab active" : "exercise-tab"}
                type="button"
                aria-pressed={candidate.id === problem.id}
                onClick={() => { void selectProblem(candidate.id); }}
                disabled={!hasStarted}
              >
                <span>Problem {index + 1}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2>課題</h2>
          <p>{problem.promptMd}</p>
        </section>
      </aside>
      <div className="editor-pane">
        <div className="editor-toolbar">
          <span>Python Mock Exam</span>
          <button type="button" onClick={startExam} disabled={hasStarted}>
            開始
          </button>
          <button type="button" onClick={pauseExam} disabled={session.status !== "in_progress"}>
            一時停止
          </button>
          <button type="button" onClick={resumeExam} disabled={session.status !== "paused"}>
            再開
          </button>
        </div>
        <div className="monaco-host">
          <CodeEditor value={code} fontSize={settings.editorFontSize} tabSize={settings.tabSize} onChange={handleCodeChange} />
        </div>
        <div className="console-pane" aria-label="Mock exam status">
          <p>{hasStarted ? "回答はこのブラウザに保存されます。" : "開始すると問題移動と一時停止が使えます。"}</p>
          <div className="completion-actions">
            <button type="button" className="secondary-action inline-action" onClick={() => { void selectProblem(exam.problems[Math.max(0, activeProblemIndex - 1)].id); }} disabled={!hasStarted || activeProblemIndex === 0}>
              前の問題
            </button>
            <button type="button" className="primary-action inline-action" onClick={() => { void selectProblem(exam.problems[Math.min(exam.problems.length - 1, activeProblemIndex + 1)].id); }} disabled={!hasStarted || activeProblemIndex === exam.problems.length - 1}>
              次の問題
            </button>
            <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
              Curriculumへ戻る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
