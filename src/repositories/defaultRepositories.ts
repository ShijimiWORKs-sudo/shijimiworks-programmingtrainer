import { BrowserProgressRepository } from "./BrowserProgressRepository";
import { BrowserSettingsRepository } from "./BrowserSettingsRepository";

export const localUserId = "local-user";
export const progressRepository = new BrowserProgressRepository();
export const settingsRepository = new BrowserSettingsRepository();
