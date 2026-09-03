import { NavLink, Outlet } from "react-router-dom";
import { routePaths } from "../../app/routePaths";

const navItems = [
  { to: routePaths.home, label: "Home", end: true },
  { to: routePaths.languages, label: "Languages" },
  { to: routePaths.history, label: "History" },
  { to: routePaths.settings, label: "Settings" },
] as const;

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to={routePaths.home} className="brand" aria-label="Programming Trainer Home">
          Programming Trainer
        </NavLink>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : undefined}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}


