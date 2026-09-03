import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { pythonGrade3Course } from "../content/python/grade-3";

export function PythonGrade3CurriculumPage() {
  return (
    <section className="page-panel">
      <PageHeader title={pythonGrade3Course.title} eyebrow="SCR-030" />
      <div className="curriculum-list">
        {pythonGrade3Course.chapters.map((chapter) => (
          <article key={chapter.id} className="chapter-block">
            <div>
              <p className="eyebrow">Chapter {chapter.order}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.description}</p>
            </div>
            <div className="lesson-list">
              {chapter.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  className="lesson-row"
                  to={routePaths.pythonGrade3Lesson(lesson.id)}
                >
                  <span>{lesson.title}</span>
                  <StatusBadge status={lesson.status} />
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

