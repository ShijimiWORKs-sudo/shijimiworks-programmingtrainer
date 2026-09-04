import type { RunErrorType, RunResult } from "./LanguageRunner";

function classifyError(error: unknown): RunErrorType {
  if (error instanceof SyntaxError) {
    return "syntax_error";
  }
  return "runtime_error";
}

function normalizeStdin(stdin: string) {
  return stdin.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function formatConsoleValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  if (value === undefined) {
    return "undefined";
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export async function runJavaScriptSource(sourceCode: string, stdin: string): Promise<RunResult> {
  const startedAt = performance.now();
  const stdinLines = normalizeStdin(stdin);
  let stdinIndex = 0;
  let stdout = "";

  const readline = () => {
    const line = stdinLines[stdinIndex] ?? "";
    stdinIndex += 1;
    return line;
  };
  const capturedConsole = {
    log: (...values: unknown[]) => {
      stdout += values.map(formatConsoleValue).join(" ") + "\n";
    },
  };

  try {
    const execute = new Function(
      "console",
      "readline",
      "input",
      "self",
      "globalThis",
      "window",
      "document",
      "fetch",
      "XMLHttpRequest",
      "WebSocket",
      "importScripts",
      "postMessage",
      '"use strict";\n' + sourceCode
    ) as (...args: unknown[]) => unknown;

    await execute(
      capturedConsole,
      readline,
      readline,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    return {
      status: "success",
      stdout,
      stderr: "",
      durationMs: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    return {
      status: "runtime_error",
      stdout,
      stderr: error instanceof Error ? error.message : String(error),
      durationMs: Math.round(performance.now() - startedAt),
      errorType: classifyError(error),
    };
  }
}
