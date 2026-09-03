import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

const pythonLanguage = languages.find((language) => language.slug === "python");

export function PythonLevelSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Python Level Select" eyebrow="SCR-020" />
      <div className="card-grid compact">
        {pythonLanguage?.levels.map((level) =>
          level.code === "grade-3" ? (
            <Link key={level.id} className="select-card interactive" to={routePaths.pythonGrade3}>
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

