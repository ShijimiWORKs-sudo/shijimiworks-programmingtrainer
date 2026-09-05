import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

const rubyLanguage = languages.find((language) => language.slug === "ruby");

export function RubyLevelSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Ruby Level Select" eyebrow="SCR-020" />
      <div className="card-grid compact">
        {rubyLanguage?.levels.map((level) =>
          level.code === "grade-1" || level.code === "grade-2" || level.code === "grade-3" ? (
            <Link
              key={level.id}
              className="select-card interactive"
              to={level.code === "grade-1" ? routePaths.rubyGrade1 : level.code === "grade-2" ? routePaths.rubyGrade2 : routePaths.rubyGrade3}
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
