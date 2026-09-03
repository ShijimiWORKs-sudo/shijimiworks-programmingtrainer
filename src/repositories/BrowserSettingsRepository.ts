import type { AppSettings } from "../domain/progress";
import type { SettingsRepository } from "./SettingsRepository";
import { getProgrammingTrainerDb } from "./db";

export const defaultSettings: AppSettings = {
  userId: "local-user",
  editorTheme: "dark",
  editorFontSize: 16,
  tabSize: 4,
  updatedAt: new Date(0).toISOString(),
};

export class BrowserSettingsRepository implements SettingsRepository {
  async getSettings(userId: string) {
    const db = await getProgrammingTrainerDb();
    return db.get("settings", userId);
  }

  async saveSettings(settings: AppSettings) {
    const db = await getProgrammingTrainerDb();
    await db.put("settings", settings);
  }

  async getOrCreateSettings(userId: string) {
    const settings = await this.getSettings(userId);
    if (settings) {
      return settings;
    }

    const created = { ...defaultSettings, userId, updatedAt: new Date().toISOString() };
    await this.saveSettings(created);
    return created;
  }
}
