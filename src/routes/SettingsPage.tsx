import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import type { AppSettings } from "../domain/progress";
import { defaultSettings, localUserId, settingsRepository } from "../repositories";

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ ...defaultSettings, userId: localUserId });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void settingsRepository.getOrCreateSettings(localUserId).then(setSettings);
  }, []);

  async function save(nextSettings: AppSettings) {
    setSettings(nextSettings);
    setSaved(false);
    await settingsRepository.saveSettings({ ...nextSettings, updatedAt: new Date().toISOString() });
    setSaved(true);
  }

  return (
    <section className="page-panel">
      <PageHeader title="Settings" eyebrow="SCR-090" />
      <form className="settings-form">
        <label>
          Editor font size
          <input
            aria-label="Editor font size"
            type="number"
            min="12"
            max="28"
            value={settings.editorFontSize}
            onChange={(event) => void save({ ...settings, editorFontSize: Number(event.target.value) })}
          />
        </label>
        <label>
          Tab size
          <input
            aria-label="Tab size"
            type="number"
            min="2"
            max="8"
            value={settings.tabSize}
            onChange={(event) => void save({ ...settings, tabSize: Number(event.target.value) })}
          />
        </label>
        <label>
          Theme
          <select
            aria-label="Theme"
            value={settings.editorTheme}
            onChange={(event) => void save({ ...settings, editorTheme: event.target.value as AppSettings["editorTheme"] })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <p className="settings-status">{saved ? "保存しました" : "変更は自動保存されます"}</p>
      </form>
    </section>
  );
}
