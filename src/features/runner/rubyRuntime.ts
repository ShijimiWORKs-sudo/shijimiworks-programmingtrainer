import type { RunErrorType, RunResult } from "./LanguageRunner";

class RubyCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RubyCompileError";
  }
}

function classifyError(error: unknown): RunErrorType {
  if (error instanceof RubyCompileError || error instanceof SyntaxError) {
    return "syntax_error";
  }
  return "runtime_error";
}

function normalizeStdin(stdin: string) {
  return stdin.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function stripComments(source: string) {
  return source
    .split("\n")
    .map((line) => line.replace(/\s+#.*$/, "").replace(/^#.*$/, ""))
    .join("\n");
}

function transformInterpolatedStrings(source: string) {
  return source.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, body: string) => {
    if (!body.includes("#{")) {
      return match;
    }
    return "`" + body.replace(/\$\{/g, "\\${").replace(/#\{([^}]+)\}/g, "${$1}") + "`";
  });
}

function transformGets(source: string) {
  return source
    .replace(/\bgets\s*\.\s*chomp\s*\.\s*to_i\b/g, "Number.parseInt(__readLine(), 10)")
    .replace(/\bgets\s*\.\s*to_i\b/g, "Number.parseInt(__readLine(), 10)")
    .replace(/\bgets\s*\.\s*chomp\s*\.\s*to_f\b/g, "Number.parseFloat(__readLine())")
    .replace(/\bgets\s*\.\s*to_f\b/g, "Number.parseFloat(__readLine())")
    .replace(/\bgets\s*\.\s*chomp\b/g, "__readLine()")
    .replace(/\bgets\b/g, "__readLine()");
}

function transformOperators(source: string) {
  return source
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\bnot\b/g, "!")
    .replace(/\bnil\b/g, "undefined");
}

function collectAssignedVariables(source: string) {
  const variables = new Set<string>();

  for (const match of source.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)/gm)) {
    variables.add(match[1]);
  }

  return variables;
}

function splitLines(source: string) {
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function transformLine(line: string) {
  let match = /^def\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:\(([^)]*)\))?\s*$/.exec(line);
  if (match) {
    return `function ${match[1]}(${match[2] ?? ""}) {`;
  }

  match = /^if\s+(.+)$/.exec(line);
  if (match) {
    return `if (${match[1]}) {`;
  }

  match = /^elsif\s+(.+)$/.exec(line);
  if (match) {
    return `} else if (${match[1]}) {`;
  }

  if (line === "else") {
    return "} else {";
  }

  match = /^while\s+(.+)$/.exec(line);
  if (match) {
    return `while (${match[1]}) {`;
  }

  match = /^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)\.\.(.+)$/.exec(line);
  if (match) {
    return `for (let ${match[1]} = ${match[2]}; ${match[1]} <= ${match[3]}; ${match[1]} += 1) {`;
  }

  match = /^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)$/.exec(line);
  if (match) {
    return `for (const ${match[1]} of ${match[2]}) {`;
  }

  if (line === "end") {
    return "}";
  }

  match = /^puts(?:\s+(.+))?$/.exec(line);
  if (match) {
    return `__puts(${match[1] ?? '""'});`;
  }

  match = /^print(?:\s+(.+))?$/.exec(line);
  if (match) {
    return `__print(${match[1] ?? '""'});`;
  }

  return line.endsWith(";") || line.endsWith("{") || line.endsWith("}") ? line : line + ";";
}

function compileRubySubset(sourceCode: string) {
  const prepared = transformOperators(transformGets(transformInterpolatedStrings(stripComments(sourceCode))));
  const variablePrelude = Array.from(collectAssignedVariables(prepared))
    .map((name) => `let ${name};`)
    .join("\n");
  const body = splitLines(prepared).map(transformLine).join("\n");

  if (!body.trim()) {
    throw new RubyCompileError("Ruby source must contain runnable code.");
  }

  return `${variablePrelude}\n${body}`;
}

export async function runRubySource(sourceCode: string, stdin: string): Promise<RunResult> {
  const startedAt = performance.now();
  const stdinLines = normalizeStdin(stdin);
  let stdinIndex = 0;
  let stdout = "";

  const readLine = () => {
    const line = stdinLines[stdinIndex] ?? "";
    stdinIndex += 1;
    return line.replace(/\n$/, "");
  };
  const puts = (value: unknown = "") => {
    stdout += String(value) + "\n";
  };
  const print = (value: unknown = "") => {
    stdout += String(value);
  };

  try {
    const compiledSource = compileRubySubset(sourceCode);
    const execute = new Function(
      "__puts",
      "__print",
      "__readLine",
      "self",
      "globalThis",
      "window",
      "document",
      "fetch",
      "XMLHttpRequest",
      "WebSocket",
      "importScripts",
      "postMessage",
      '"use strict";\n' + compiledSource
    ) as (...args: unknown[]) => unknown;

    await execute(
      puts,
      print,
      readLine,
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
