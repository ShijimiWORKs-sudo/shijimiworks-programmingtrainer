import React from "react";
import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class TestWorker {
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}

vi.stubGlobal("Worker", TestWorker);
vi.mock("monaco-editor", () => ({}));
vi.mock("@monaco-editor/react", () => ({
  default: ({ value, onChange }: { value: string; onChange(value: string): void }) =>
    React.createElement("textarea", {
      "aria-label": "Python code editor",
      value,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    }),
  loader: { config: vi.fn() },
}));
