import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { languages } from "../content/catalog";

export function LanguageSelectPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Language Select" eyebrow="SCR-010" />
      <div className="card-grid">
        {languages.map((language) => {
          const content = (
            <>
              <span>{language.name}</span>
              <StatusBadge status={language.status} />
            </>
          );

          return language.slug === "python" ? (
            <Link key={language.id} className="select-card interactive" to={routePaths.python}>
              {content}
            </Link>
          ) : (
            <div key={language.id} className="select-card muted" aria-disabled="true">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

