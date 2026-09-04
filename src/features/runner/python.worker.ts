import { loadPyodide, type PyodideInterface } from "pyodide";
import type { RunErrorType, RunResult } from "./LanguageRunner";
import type { PythonWorkerRequest, PythonWorkerResponse } from "./pythonProtocol";

let pyodidePromise: Promise<PyodideInterface> | undefined;

function post(response: PythonWorkerResponse) {
  self.postMessage(response);
}

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({ indexURL: "/pyodide/" });
  }

  return pyodidePromise;
}

function classifyError(error: unknown): RunErrorType {
  const message = String(error);
  if (message.includes("SyntaxError")) {
    return "syntax_error";
  }
  if (message.includes("KeyboardInterrupt")) {
    return "cancelled";
  }
  return "runtime_error";
}

function appendBatchedLine(buffer: string, output: string) {
  return buffer + output + (output.endsWith("\n") ? "" : "\n");
}

async function runPython(sourceCode: string, stdin: string): Promise<RunResult> {
  const pyodide = await getPyodide();
  const startedAt = performance.now();
  const stdinLines = stdin.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let stdinIndex = 0;
  let stdout = "";
  let stderr = "";

  pyodide.setStdin({
    stdin: () => {
      const line = stdinLines[stdinIndex] ?? "";
      stdinIndex += 1;
      return line;
    },
  });
  pyodide.setStdout({ batched: (output) => { stdout = appendBatchedLine(stdout, output); } });
  pyodide.setStderr({ batched: (output) => { stderr = appendBatchedLine(stderr, output); } });

  try {
    await pyodide.runPythonAsync(sourceCode);
    return {
      status: "success",
      stdout,
      stderr,
      durationMs: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    const errorType = classifyError(error);
    return {
      status: "runtime_error",
      stdout,
      stderr: stderr || (error instanceof Error ? error.message : String(error)),
      durationMs: Math.round(performance.now() - startedAt),
      errorType,
    };
  }
}

self.addEventListener("message", (event: MessageEvent<PythonWorkerRequest>) => {
  const request = event.data;

  void (async () => {
    try {
      if (request.type === "initialize") {
        await getPyodide();
        post({ id: request.id, type: "initialized" });
        return;
      }

      if (request.type === "reset") {
        pyodidePromise = undefined;
        post({ id: request.id, type: "reset-done" });
        return;
      }

      const result = await runPython(request.sourceCode, request.stdin);
      post({ id: request.id, type: "run-result", result });
    } catch (error) {
      post({
        id: request.id,
        type: "error",
        errorType: classifyError(error),
        message: error instanceof Error ? error.message : String(error),
      });
    }
  })();
});
