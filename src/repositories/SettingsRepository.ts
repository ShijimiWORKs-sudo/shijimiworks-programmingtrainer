import type { AppSettings } from "../domain/progress";

export interface SettingsRepository {
  getSettings(userId: string): Promise<AppSettings | undefined>;
  saveSettings(settings: AppSettings): Promise<void>;
}
