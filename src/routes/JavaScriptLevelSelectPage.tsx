import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

const javascriptLanguage = languages.find((language) => language.slug === "javascript");

export function JavaScriptLevelSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="JavaScript Level Select" eyebrow="SCR-020" />
      <div className="card-grid compact">
        {javascriptLanguage?.levels.map((level) =>
          level.code === "grade-3" ? (
            <Link key={level.id} className="select-card interactive" to={routePaths.javascriptGrade3}>
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
