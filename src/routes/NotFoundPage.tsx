import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";

export function NotFoundPage() {
  return (
    <section className="page-panel">
      <h1>Page not found</h1>
      <Link className="secondary-action inline-action" to={routePaths.home}>
        Homeへ戻る
      </Link>
    </section>
  );
}

