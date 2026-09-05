import type { RunErrorType, RunResult } from "./LanguageRunner";

class CppCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CppCompileError";
  }
}

type CppType = "int" | "double" | "bool" | "string";

function classifyError(error: unknown): RunErrorType {
  if (error instanceof CppCompileError || error instanceof SyntaxError) {
    return "syntax_error";
  }
  return "runtime_error";
}

function normalizeStdin(stdin: string) {
  return stdin.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd().split(/\s+/).filter(Boolean);
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
    throw new CppCompileError("C++ function body must use braces.");
  }

  const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
  if (closeBraceIndex < 0) {
    throw new CppCompileError("C++ function body is missing a closing brace.");
  }

  return {
    body: source.slice(openBraceIndex + 1, closeBraceIndex),
    end: closeBraceIndex + 1,
    start: match.index,
    signature: match[0],
  };
}

function stripComments(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function sanitizeSource(source: string) {
  return stripComments(source)
    .replace(/^\s*#include\s+[<"][^>"]+[>"].*$/gm, "")
    .replace(/\busing\s+namespace\s+std\s*;/g, "");
}

function normalizeCppType(typeName: string): CppType {
  if (typeName === "string" || typeName === "std::string") {
    return "string";
  }
  if (typeName === "double" || typeName === "float") {
    return "double";
  }
  if (typeName === "bool") {
    return "bool";
  }
  return "int";
}

function collectVariableTypes(source: string) {
  const types = new Map<string, CppType>();
  const declarationPattern = /\b(?:const\s+)?(int|double|float|bool|std::string|string)\s*(?:&|\*)?\s+([A-Za-z_][A-Za-z0-9_]*)/g;

  for (const match of source.matchAll(declarationPattern)) {
    types.set(match[2], normalizeCppType(match[1]));
  }

  return types;
}

function transformParameters(parameters: string, variableTypes: Map<string, CppType>) {
  const trimmed = parameters.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .split(",")
    .map((parameter) => {
      const match = /(?:const\s+)?(?:int|double|float|bool|std::string|string)\s*(?:&|\*)?\s+([A-Za-z_][A-Za-z0-9_]*)/.exec(
        parameter.trim()
      );
      if (!match) {
        throw new CppCompileError("Unsupported C++ parameter declaration.");
      }
      const name = match[1];
      const typeMatch = /(int|double|float|bool|std::string|string)/.exec(parameter);
      if (typeMatch) {
        variableTypes.set(name, normalizeCppType(typeMatch[1]));
      }
      return name;
    })
    .join(", ");
}

function splitInsertionChain(chain: string) {
  const parts: string[] = [];
  let current = "";
  let quote: "'" | '"' | undefined;
  let escaped = false;

  for (let index = 0; index < chain.length; index += 1) {
    const char = chain[index];
    const next = chain[index + 1];

    if (quote) {
      current += char;
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
      current += char;
      continue;
    }

    if (char === "<" && next === "<") {
      parts.push(current.trim());
      current = "";
      index += 1;
      continue;
    }

    current += char;
  }

  parts.push(current.trim());
  return parts.filter(Boolean);
}

function transformCoutStatements(source: string) {
  return source.replace(/(?:std::)?cout\s*<<\s*([^;]+);/g, (_match, chain: string) => {
    const args = splitInsertionChain(chain).map((part) =>
      part === "endl" || part === "std::endl" ? '"\\n"' : part
    );
    return `__cout(${args.join(", ")});`;
  });
}

function transformCinStatements(source: string, variableTypes: Map<string, CppType>) {
  return source.replace(/(?:std::)?cin\s*>>\s*([^;]+);/g, (_match, chain: string) =>
    chain
      .split(">>")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => `${name} = __readToken("${variableTypes.get(name) ?? "string"}");`)
      .join("\n")
  );
}

function transformDeclarations(source: string) {
  return source
    .replace(/\b(?:std::string|string|int|double|float|bool)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\[[^\]]+\]\s*=\s*\{/g, "let $1 = [")
    .replace(/\b(?:const\s+)?(?:std::string|string|int|double|float|bool)\s*(?:&|\*)?\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g, "let $1 =")
    .replace(/\b(?:std::string|string|int|double|float|bool)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/g, "let $1;")
    .replace(/\btrue\b/g, "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/\}\s*;/g, "];");
}

function transformFunctions(source: string, variableTypes: Map<string, CppType>) {
  return source.replace(
    /\b(?:int|double|float|bool|std::string|string|void)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*\{/g,
    (_match, functionName: string, parameters: string) =>
      `function ${functionName}(${transformParameters(parameters, variableTypes)}) {`
  );
}

function transformCppStatements(source: string, variableTypes: Map<string, CppType>) {
  return transformDeclarations(transformCinStatements(transformCoutStatements(source), variableTypes));
}

function compileCppSubset(sourceCode: string) {
  const source = sanitizeSource(sourceCode);
  const variableTypes = collectVariableTypes(source);
  const main = extractBlock(source, /\bint\s+main\s*\(\s*(?:void)?\s*\)\s*\{/);

  if (!main) {
    throw new CppCompileError("C++ source must define int main().");
  }

  const beforeMain = source.slice(0, main.start);
  const afterMain = source.slice(main.end);
  const functions = transformCppStatements(transformFunctions(beforeMain + "\n" + afterMain, variableTypes), variableTypes);
  const mainBody = transformCppStatements(main.body, variableTypes);

  return `${functions}\n${mainBody}`;
}

export async function runCppSource(sourceCode: string, stdin: string): Promise<RunResult> {
  const startedAt = performance.now();
  const stdinTokens = normalizeStdin(stdin);
  let stdinIndex = 0;
  let stdout = "";

  const readToken = (type: CppType) => {
    const token = stdinTokens[stdinIndex] ?? "";
    stdinIndex += 1;
    if (type === "int") {
      return Number.parseInt(token, 10);
    }
    if (type === "double") {
      return Number.parseFloat(token);
    }
    if (type === "bool") {
      return token === "true" || token === "1";
    }
    return token;
  };
  const cout = (...values: unknown[]) => {
    stdout += values.map((value) => String(value)).join("");
  };

  try {
    const compiledSource = compileCppSubset(sourceCode);
    const execute = new Function(
      "__cout",
      "__readToken",
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

    await execute(cout, readToken, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

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
