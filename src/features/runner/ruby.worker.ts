import type { RubyWorkerRequest, RubyWorkerResponse } from "./rubyProtocol";
import { runRubySource } from "./rubyRuntime";

function post(response: RubyWorkerResponse) {
  self.postMessage(response);
}

self.addEventListener("message", (event: MessageEvent<RubyWorkerRequest>) => {
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

      const result = await runRubySource(request.sourceCode, request.stdin);
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
