import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Attempt, AppSettings, ChallengeProgress, LessonProgress, MockExamSession } from "../domain/progress";

interface ProgrammingTrainerDb extends DBSchema {
  lessonProgress: {
    key: string;
    value: LessonProgress;
    indexes: {
      "by-user": string;
      "by-user-lesson": [string, string];
      "by-user-updated": [string, string];
    };
  };
  challengeProgress: {
    key: string;
    value: ChallengeProgress;
    indexes: {
      "by-user": string;
      "by-user-challenge": [string, string];
      "by-user-updated": [string, string];
    };
  };
  mockExamSessions: {
    key: string;
    value: MockExamSession;
    indexes: {
      "by-user": string;
      "by-user-exam": [string, string];
      "by-user-updated": [string, string];
    };
  };
  attempts: {
    key: string;
    value: Attempt;
    indexes: {
      "by-user": string;
      "by-user-lesson": [string, string];
      "by-created": string;
    };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

let dbPromise: Promise<IDBPDatabase<ProgrammingTrainerDb>> | undefined;
let dbInstance: IDBPDatabase<ProgrammingTrainerDb> | undefined;

export function getProgrammingTrainerDb() {
  if (!dbPromise) {
    dbPromise = openDB<ProgrammingTrainerDb>("programming-trainer", 3, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const progressStore = db.createObjectStore("lessonProgress", { keyPath: "id" });
          progressStore.createIndex("by-user", "userId");
          progressStore.createIndex("by-user-lesson", ["userId", "lessonId"], { unique: true });
          progressStore.createIndex("by-user-updated", ["userId", "updatedAt"]);

          const attemptStore = db.createObjectStore("attempts", { keyPath: "id" });
          attemptStore.createIndex("by-user", "userId");
          attemptStore.createIndex("by-user-lesson", ["userId", "lessonId"]);
          attemptStore.createIndex("by-created", "createdAt");

          db.createObjectStore("settings", { keyPath: "userId" });
        }

        if (oldVersion < 2 && !db.objectStoreNames.contains("challengeProgress")) {
          const challengeProgressStore = db.createObjectStore("challengeProgress", { keyPath: "id" });
          challengeProgressStore.createIndex("by-user", "userId");
          challengeProgressStore.createIndex("by-user-challenge", ["userId", "challengeId"], { unique: true });
          challengeProgressStore.createIndex("by-user-updated", ["userId", "updatedAt"]);
        }

        if (oldVersion < 3 && !db.objectStoreNames.contains("mockExamSessions")) {
          const mockExamSessionStore = db.createObjectStore("mockExamSessions", { keyPath: "id" });
          mockExamSessionStore.createIndex("by-user", "userId");
          mockExamSessionStore.createIndex("by-user-exam", ["userId", "examId"], { unique: true });
          mockExamSessionStore.createIndex("by-user-updated", ["userId", "updatedAt"]);
        }
      },
    }).then((db) => {
      dbInstance = db;
      return db;
    });
  }

  return dbPromise;
}

export function resetDbConnectionForTests() {
  dbInstance?.close();
  dbInstance = undefined;
  dbPromise = undefined;
}
