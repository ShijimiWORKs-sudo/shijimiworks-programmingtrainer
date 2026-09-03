import { PageHeader } from "../components/PageHeader";

export function SettingsPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Settings" eyebrow="SCR-090" />
      <form className="settings-form">
        <label>
          Editor font size
          <input type="number" min="12" max="28" defaultValue="16" disabled />
        </label>
        <label>
          Tab size
          <input type="number" min="2" max="8" defaultValue="4" disabled />
        </label>
        <label>
          Theme
          <select defaultValue="light" disabled>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </form>
    </section>
  );
}

