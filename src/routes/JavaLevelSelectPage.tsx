import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

const javaLanguage = languages.find((language) => language.slug === "java");

export function JavaLevelSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Java Level Select" eyebrow="SCR-020" />
      <div className="card-grid compact">
        {javaLanguage?.levels.map((level) =>
          level.code === "grade-1" || level.code === "grade-2" || level.code === "grade-3" ? (
            <Link
              key={level.id}
              className="select-card interactive"
              to={level.code === "grade-1" ? routePaths.javaGrade1 : level.code === "grade-2" ? routePaths.javaGrade2 : routePaths.javaGrade3}
            >
              <span>{level.name}</span>
              <StatusBadge status={level.status} />
            </Link>
          ) : (
            <div key={level.id} className="select-card muted" aria-disabled="true">
              <span>{level.name}</span>
              <StatusBadge status={level.status} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
