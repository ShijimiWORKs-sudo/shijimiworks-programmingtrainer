import type { RunErrorType, RunResult } from "./LanguageRunner";

class JavaCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JavaCompileError";
  }
}

function classifyError(error: unknown): RunErrorType {
  if (error instanceof JavaCompileError || error instanceof SyntaxError) {
    return "syntax_error";
  }
  return "runtime_error";
}

function normalizeStdin(stdin: string) {
  return stdin.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function findMatchingBrace(source: string, openBraceIndex: number) {
  let depth = 0;
  let quote: "'" | '"' | undefined;
  let escaped = false;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = undefined;
      }
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function extractBlock(source: string, signature: RegExp) {
  const match = signature.exec(source);
  if (!match || match.index === undefined) {
    return undefined;
  }

  const openBraceIndex = source.indexOf("{", match.index + match[0].length - 1);
  if (openBraceIndex < 0) {
    throw new JavaCompileError("Java method body must use braces.");
  }

  const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
  if (closeBraceIndex < 0) {
    throw new JavaCompileError("Java method body is missing a closing brace.");
  }

  return {
    body: source.slice(openBraceIndex + 1, closeBraceIndex),
    end: closeBraceIndex + 1,
    start: match.index,
    signature: match[0],
  };
}

function extractClassBody(sourceCode: string) {
  const classMatch = /\bclass\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/.exec(sourceCode);
  if (!classMatch || classMatch.index === undefined) {
    throw new JavaCompileError("Java source must define a class.");
  }

  const openBraceIndex = sourceCode.indexOf("{", classMatch.index + classMatch[0].length - 1);
  const closeBraceIndex = findMatchingBrace(sourceCode, openBraceIndex);
  if (closeBraceIndex < 0) {
    throw new JavaCompileError("Java class body is missing a closing brace.");
  }

  return sourceCode.slice(openBraceIndex + 1, closeBraceIndex);
}

function stripComments(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function transformParameters(parameters: string) {
  const trimmed = parameters.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .split(",")
    .map((parameter) => {
      const parts = parameter.trim().split(/\s+/);
      return parts[parts.length - 1].replace(/\[\]$/, "");
    })
    .join(", ");
}

function transformJavaStatements(source: string) {
  return source
    .replace(/\bScanner\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;/g, "")
    .replace(/\b[A-Za-z_][A-Za-z0-9_]*\.nextLine\s*\(\s*\)/g, "__nextLine()")
    .replace(/\b[A-Za-z_][A-Za-z0-9_]*\.nextInt\s*\(\s*\)/g, "Number.parseInt(__nextLine(), 10)")
    .replace(/\b[A-Za-z_][A-Za-z0-9_]*\.nextDouble\s*\(\s*\)/g, "Number.parseFloat(__nextLine())")
    .replace(/\bSystem\.out\.println\s*\(/g, "__print(")
    .replace(/\bSystem\.out\.print\s*\(/g, "__printInline(")
    .replace(/\bnew\s+String\s*\[\]\s*\{/g, "[")
    .replace(/\bnew\s+(?:int|double|boolean)\s*\[\]\s*\{/g, "[")
    .replace(/\b(String|int|double|boolean)(?:\s*\[\])?\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g, "let $2 =")
    .replace(/\b(String|int|double|boolean)(?:\s*\[\])?\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/g, "let $2;")
    .replace(/\bfinal\s+/g, "")
    .replace(/\btrue\b/g, "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/\}\s*;/g, "];");
}

function transformStaticMethods(source: string) {
  return source.replace(
    /(?:public|private)?\s*static\s+(?:String|int|double|boolean|void)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*\{/g,
    (_match, methodName: string, parameters: string) => `function ${methodName}(${transformParameters(parameters)}) {`
  );
}

function compileJavaSubset(sourceCode: string) {
  const source = stripComments(sourceCode);
  const classBody = extractClassBody(source);

  const main = extractBlock(
    classBody,
    /(?:public\s+)?static\s+void\s+main\s*\(\s*String\s*(?:\[\]\s*args|args\s*\[\])\s*\)\s*\{/
  );
  if (!main) {
    throw new JavaCompileError("Java source must define static void main(String[] args).");
  }

  const beforeMain = classBody.slice(0, main.start);
  const afterMain = classBody.slice(main.end);
  const methods = transformJavaStatements(transformStaticMethods(beforeMain + "\n" + afterMain));
  const mainBody = transformJavaStatements(main.body);

  return `${methods}\n${mainBody}`;
}

export async function runJavaSource(sourceCode: string, stdin: string): Promise<RunResult> {
  const startedAt = performance.now();
  const stdinLines = normalizeStdin(stdin);
  let stdinIndex = 0;
  let stdout = "";

  const nextLine = () => {
    const line = stdinLines[stdinIndex] ?? "";
    stdinIndex += 1;
    return line;
  };
  const print = (value: unknown = "") => {
    stdout += String(value) + "\n";
  };
  const printInline = (value: unknown = "") => {
    stdout += String(value);
  };

  try {
    const compiledSource = compileJavaSubset(sourceCode);
    const execute = new Function(
      "__print",
      "__printInline",
      "__nextLine",
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
      print,
      printInline,
      nextLine,
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
