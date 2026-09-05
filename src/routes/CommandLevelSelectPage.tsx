import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

const commandLanguage = languages.find((language) => language.slug === "command");

export function CommandLevelSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Command Level Select" eyebrow="SCR-020" />
      <div className="card-grid compact">
        {commandLanguage?.levels.map((level) => (
          <Link
            key={level.id}
            className="select-card interactive"
            to={level.code === "grade-1" ? routePaths.commandGrade1 : level.code === "grade-2" ? routePaths.commandGrade2 : routePaths.commandGrade3}
          >
            <span>{level.name}</span>
            <StatusBadge status={level.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}
