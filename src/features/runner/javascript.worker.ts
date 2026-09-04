import { runJavaScriptSource } from "./javascriptRuntime";
import type { JavaScriptWorkerRequest, JavaScriptWorkerResponse } from "./javascriptProtocol";

function post(response: JavaScriptWorkerResponse) {
  self.postMessage(response);
}

self.addEventListener("message", (event: MessageEvent<JavaScriptWorkerRequest>) => {
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

      const result = await runJavaScriptSource(request.sourceCode, request.stdin);
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
