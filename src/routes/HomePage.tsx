import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";

export function HomePage() {
  return (
    <section className="page-panel">
      <PageHeader title="Programming Trainer" eyebrow="PC Web Learning">
        <p>コードを書いて学ぶための基盤を準備しています。</p>
      </PageHeader>
      <div className="action-grid">
        <Link className="primary-action" to={routePaths.languages}>
          言語を選択
        </Link>
        <Link className="secondary-action" to={routePaths.history}>
          学習履歴
        </Link>
        <Link className="secondary-action" to={routePaths.settings}>
          設定
        </Link>
      </div>
    </section>
  );
}

