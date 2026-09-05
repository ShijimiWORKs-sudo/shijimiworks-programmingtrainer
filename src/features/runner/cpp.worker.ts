import type { CppWorkerRequest, CppWorkerResponse } from "./cppProtocol";
import { runCppSource } from "./cppRuntime";

function post(response: CppWorkerResponse) {
  self.postMessage(response);
}

self.addEventListener("message", (event: MessageEvent<CppWorkerRequest>) => {
  const request = event.data;

  void (async () => {
    try {
      if (request.type === "initialize") {
        post({ id: request.id, type: "initialized" });
        return;
      }

      if (request.type === "reset") {
        post({ id: request.id, type: "reset-done" });
        return;
      }

      const result = await runCppSource(request.sourceCode, request.stdin);
      post({ id: request.id, type: "run-result", result });
    } catch (error) {
      post({
        id: request.id,
        type: "error",
        errorType: "unknown",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  })();
});
