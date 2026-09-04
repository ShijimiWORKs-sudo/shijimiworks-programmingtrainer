import { describe, expect, it } from "vitest";
import { runJavaScriptSource } from "./javascriptRuntime";

describe("runJavaScriptSource", () => {
  it("captures console.log output and readline input", async () => {
    const result = await runJavaScriptSource(
      "const name = readline();\nconst score = Number(input());\nconsole.log(name + ':' + score);",
      "Aki\n82\n"
    );

    expect(result).toMatchObject({
      status: "success",
      stdout: "Aki:82\n",
      stderr: "",
    });
  });

  it("formats multiple console values as stdout", async () => {
    const result = await runJavaScriptSource("console.log('sum', 7, { ok: true });", "");

    expect(result.stdout).toBe("sum 7 {\"ok\":true}\n");
  });

  it("reports syntax errors separately from runtime errors", async () => {
    const syntaxResult = await runJavaScriptSource("const =", "");
    const runtimeResult = await runJavaScriptSource("throw new Error('boom');", "");

    expect(syntaxResult).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
    expect(runtimeResult).toMatchObject({ status: "runtime_error", errorType: "runtime_error" });
  });
});
