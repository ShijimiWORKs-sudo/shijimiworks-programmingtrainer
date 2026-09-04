import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { pythonGrade2Course } from "../content/python/grade-2";

export function PythonGrade2CurriculumPage() {
  return (
    <section className="page-panel">
      <PageHeader title={pythonGrade2Course.title} eyebrow="SCR-030">
        <p>{pythonGrade2Course.description}</p>
      </PageHeader>
      <div className="curriculum-list">
        {pythonGrade2Course.chapters.map((chapter) => {
          const publishedLessonCount = chapter.lessons.filter((lesson) => lesson.status === "published").length;
          const hasPublishedLessons = publishedLessonCount > 0;

          return (
            <article key={chapter.id} className="chapter-block">
              <div className="chapter-overview">
                <p className="eyebrow">Chapter {chapter.order}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.description}</p>
                <span className={`chapter-progress-state chapter-progress-${hasPublishedLessons ? "in_progress" : "not_started"}`}>
                  {hasPublishedLessons ? `${publishedLessonCount} Lessons ready` : "Preparing"}
                </span>
              </div>
              <div className="lesson-list">
                {chapter.lessons.length > 0 ? (
                  chapter.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      className="lesson-row"
                      to={routePaths.pythonGrade2Lesson(lesson.id)}
                    >
                      <span>{lesson.title}</span>
                      <StatusBadge status={lesson.status === "published" ? "not_started" : "draft"} />
                    </Link>
                  ))
                ) : (
                  <div className="lesson-row muted" aria-disabled="true">
                    <span>P4-02 Function Deepening</span>
                    <StatusBadge status="planned" />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="completion-actions">
        <Link className="secondary-action inline-action" to={routePaths.python}>
          Level Selectへ戻る
        </Link>
      </div>
    </section>
  );
}
