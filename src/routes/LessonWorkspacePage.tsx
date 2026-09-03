import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { StatusBadge } from "../components/StatusBadge";
import { findLessonById } from "../content/catalog";

export function LessonWorkspacePage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? findLessonById(lessonId) : undefined;

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

  return (
    <section className="workspace-shell" aria-label="Lesson Workspace">
      <aside className="lesson-pane">
        <p className="eyebrow">SCR-040</p>
        <div className="lesson-title-row">
          <h1>{lesson.title}</h1>
          <StatusBadge status={lesson.status} />
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
      </aside>
      <div className="editor-pane">
        <div className="editor-toolbar">
          <span>Python</span>
          <button type="button" disabled>
            Run
          </button>
          <button type="button" disabled>
            Grade
          </button>
          <button type="button" disabled>
            Reset
          </button>
        </div>
        <textarea
          className="code-placeholder"
          aria-label="Code editor placeholder"
          value={lesson.starterCode}
          readOnly
        />
        <div className="console-pane" aria-label="Console placeholder">
          <p>Execution output will appear here in a later phase.</p>
        </div>
      </div>
    </section>
  );
}

