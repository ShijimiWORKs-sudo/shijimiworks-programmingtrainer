import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { pythonGrade1Course } from "../content/python/grade-1";

export function PythonGrade1CurriculumPage() {
  return (
    <section className="page-panel">
      <PageHeader title={pythonGrade1Course.title} eyebrow="SCR-030">
        <p>{pythonGrade1Course.description}</p>
      </PageHeader>
      <div className="curriculum-list">
        {pythonGrade1Course.chapters.map((chapter) => {
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
                {chapter.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    className="lesson-row"
                    to={routePaths.pythonGrade1Lesson(lesson.id)}
                  >
                    <span>{lesson.title}</span>
                    <StatusBadge status={lesson.status === "published" ? "not_started" : "draft"} />
                  </Link>
                ))}
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
