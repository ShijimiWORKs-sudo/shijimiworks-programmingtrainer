export interface VirtualPowerShellFileEntry {
  type: "file";
  content: string;
}

export interface VirtualPowerShellDirectoryEntry {
  type: "directory";
}

export type VirtualPowerShellFileSystemEntry = VirtualPowerShellFileEntry | VirtualPowerShellDirectoryEntry;

export interface VirtualPowerShellState {
  cwd: string;
  entries: Record<string, VirtualPowerShellFileSystemEntry>;
  history: string[];
}

export interface VirtualPowerShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  state: VirtualPowerShellState;
}

interface PipelineItem {
  text: string;
  name?: string;
  path?: string;
  entryType?: "file" | "directory";
  content?: string;
}

const defaultCwd = "C:\\Users\\student";

const defaultEntries: Record<string, VirtualPowerShellFileSystemEntry> = {
  "C:\\": { type: "directory" },
  "C:\\Users": { type: "directory" },
  "C:\\Users\\student": { type: "directory" },
  "C:\\Users\\student\\README.txt": {
    type: "file",
    content: "Welcome to the Programming Trainer virtual PowerShell.\n",
  },
  "C:\\Users\\student\\notes.txt": {
    type: "file",
    content: "Use Get-ChildItem, Set-Location, Get-Content, Write-Output, Get-Help, and Get-History.\n",
  },
  "C:\\Users\\student\\scripts": { type: "directory" },
};

function trimTrailingSlash(path: string) {
  return path.length > 3 ? path.replace(/\\+$/g, "") : path;
}

export function normalizePowerShellPath(cwd: string, rawPath: string) {
  const value = rawPath.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").replace(/\//g, "\\");
  const absolute = /^[A-Za-z]:\\/.test(value) ? value : `${trimTrailingSlash(cwd)}\\${value}`;
  const drive = absolute.slice(0, 2).toUpperCase();
  const parts = absolute
    .slice(3)
    .split("\\")
    .filter(Boolean)
    .reduce<string[]>((nextParts, part) => {
      if (part === ".") {
        return nextParts;
      }
      if (part === "..") {
        return nextParts.slice(0, -1);
      }
      return [...nextParts, part];
    }, []);

  return parts.length > 0 ? `${drive}\\${parts.join("\\")}` : `${drive}\\`;
}

function cloneEntries(entries: Record<string, VirtualPowerShellFileSystemEntry>) {
  return Object.fromEntries(Object.entries(entries).map(([path, entry]) => [normalizePowerShellPath(defaultCwd, path), { ...entry }]));
}

export function createVirtualPowerShellState(seed?: Partial<VirtualPowerShellState>): VirtualPowerShellState {
  const entries = cloneEntries(seed?.entries ?? defaultEntries);
  const cwd = normalizePowerShellPath(defaultCwd, seed?.cwd ?? defaultCwd);

  return {
    cwd: entries[cwd]?.type === "directory" ? cwd : defaultCwd,
    entries,
    history: [...(seed?.history ?? [])],
  };
}

function parsePowerShellLine(commandLine: string) {
  const tokens = [...commandLine.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((match) => match[1] ?? match[2] ?? match[3]);
  const [command = "", ...args] = tokens;
  return { command: command.toLowerCase(), args };
}

function withHistory(state: VirtualPowerShellState, commandLine: string): VirtualPowerShellState {
  return { ...state, history: [...state.history, commandLine] };
}

function childNames(state: VirtualPowerShellState, directory: string) {
  const prefix = trimTrailingSlash(directory) + "\\";
  const children = new Map<string, VirtualPowerShellFileSystemEntry>();

  for (const [path, entry] of Object.entries(state.entries)) {
    if (path === directory || !path.startsWith(prefix)) {
      continue;
    }
    const [name] = path.slice(prefix.length).split("\\");
    const childPath = prefix + name;
    children.set(name, state.entries[childPath] ?? entry);
  }

  return [...children.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function commandTarget(args: string[]) {
  const positional = args.filter((arg) => !arg.startsWith("-"));
  return positional.join(" ");
}

function getParameter(args: string[], name: string) {
  const index = args.findIndex((arg) => arg.toLowerCase() === `-${name.toLowerCase()}`);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasSwitch(args: string[], name: string) {
  return args.some((arg) => arg.toLowerCase() === `-${name.toLowerCase()}`);
}

function positionalArgs(args: string[]) {
  const valueParameters = new Set(["-path", "-literalpath", "-itemtype", "-value", "-destination"]);
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith("-")) {
      if (valueParameters.has(arg.toLowerCase())) {
        index += 1;
      }
      continue;
    }
    values.push(arg);
  }
  return values;
}

function resolveArgPath(cwd: string, args: string[], parameterName: string, positionalIndex: number) {
  const rawPath = getParameter(args, parameterName) ?? positionalArgs(args)[positionalIndex] ?? "";
  return rawPath ? normalizePowerShellPath(cwd, rawPath) : "";
}

function resolvePathArgument(cwd: string, args: string[], positionalIndex: number) {
  const rawPath = getParameter(args, "Path") ?? getParameter(args, "LiteralPath") ?? positionalArgs(args)[positionalIndex] ?? "";
  return rawPath ? normalizePowerShellPath(cwd, rawPath) : "";
}

function parentPath(path: string) {
  const normalized = trimTrailingSlash(path);
  if (/^[A-Z]:\\$/i.test(normalized)) {
    return normalized;
  }
  const index = normalized.lastIndexOf("\\");
  return index <= 2 ? normalized.slice(0, 3) : normalized.slice(0, index);
}

function baseName(path: string) {
  return trimTrailingSlash(path).split("\\").at(-1) ?? "";
}

function ensureParentDirectory(state: VirtualPowerShellState, path: string) {
  return state.entries[parentPath(path)]?.type === "directory";
}

function destinationPath(state: VirtualPowerShellState, source: string, target: string) {
  return state.entries[target]?.type === "directory" ? `${trimTrailingSlash(target)}\\${baseName(source)}` : target;
}

function descendants(state: VirtualPowerShellState, path: string) {
  const prefix = trimTrailingSlash(path) + "\\";
  return Object.keys(state.entries).filter((entryPath) => entryPath.startsWith(prefix));
}

function copyVirtualEntry(state: VirtualPowerShellState, source: string, target: string): VirtualPowerShellResult {
  const entry = state.entries[source];
  if (!entry) {
    return { stdout: "", stderr: `Cannot find path '${source}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state };
  }

  const resolvedTarget = destinationPath(state, source, target);
  if (!ensureParentDirectory(state, resolvedTarget)) {
    return { stdout: "", stderr: `Cannot find path '${parentPath(resolvedTarget)}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state };
  }

  const entries = { ...state.entries, [resolvedTarget]: { ...entry } };
  for (const childPath of descendants(state, source)) {
    const suffix = childPath.slice(trimTrailingSlash(source).length);
    entries[`${trimTrailingSlash(resolvedTarget)}${suffix}`] = { ...state.entries[childPath] };
  }

  return { stdout: "", stderr: "", exitCode: 0, state: { ...state, entries } };
}

function removeVirtualEntry(state: VirtualPowerShellState, target: string, recursive: boolean): VirtualPowerShellResult {
  const entry = state.entries[target];
  if (!entry) {
    return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state };
  }

  const childPaths = descendants(state, target);
  if (entry.type === "directory" && childPaths.length > 0 && !recursive) {
    return { stdout: "", stderr: `Cannot remove '${target}' because it is not empty in the virtual PowerShell filesystem.\n`, exitCode: 1, state };
  }

  const entries = { ...state.entries };
  delete entries[target];
  for (const childPath of childPaths) {
    delete entries[childPath];
  }

  const cwd = state.cwd === target || state.cwd.startsWith(trimTrailingSlash(target) + "\\") ? defaultCwd : state.cwd;
  return { stdout: "", stderr: "", exitCode: 0, state: { ...state, cwd, entries } };
}

function splitPipeline(commandLine: string) {
  const segments: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const character of commandLine) {
    if ((character === '"' || character === "'") && quote === null) {
      quote = character;
      current += character;
      continue;
    }
    if (character === quote) {
      quote = null;
      current += character;
      continue;
    }
    if (character === "|" && quote === null) {
      segments.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }

  segments.push(current.trim());
  return segments.filter(Boolean);
}

function wildcardToRegExp(pattern: string) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`, "i");
}

function itemValue(item: PipelineItem, property: string) {
  const normalized = property.toLowerCase();
  if (normalized === "name") {
    return item.name ?? item.text;
  }
  if (normalized === "type" || normalized === "entrytype") {
    return item.entryType ?? "";
  }
  if (normalized === "content") {
    return item.content ?? item.text;
  }
  return item.text;
}

function formatPipelineItems(items: PipelineItem[]) {
  return items.map((item) => item.text).join("\n") + (items.length > 0 ? "\n" : "");
}

function getChildItems(state: VirtualPowerShellState, cwd: string, targetArg: string): { items: PipelineItem[]; error?: string } {
  const target = targetArg ? normalizePowerShellPath(cwd, targetArg) : cwd;
  if (state.entries[target]?.type !== "directory") {
    return { items: [], error: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n` };
  }

  return {
    items: childNames(state, target).map(([name, entry]) => ({
      text: name,
      name,
      path: `${trimTrailingSlash(target)}\\${name}`,
      entryType: entry.type,
      content: entry.type === "file" ? entry.content : undefined,
    })),
  };
}

function evaluatePipelineCommand(
  state: VirtualPowerShellState,
  cwd: string,
  commandLine: string,
  inputItems: PipelineItem[]
): { items: PipelineItem[]; stderr: string; exitCode: number } {
  const { command, args } = parsePowerShellLine(commandLine);

  if (command === "write-output" || command === "echo") {
    return { items: [{ text: args.join(" ") }], stderr: "", exitCode: 0 };
  }

  if (command === "get-childitem" || command === "ls" || command === "dir") {
    const result = getChildItems(state, cwd, commandTarget(args));
    return result.error ? { items: [], stderr: result.error, exitCode: 1 } : { items: result.items, stderr: "", exitCode: 0 };
  }

  if (command === "get-content" || command === "cat" || command === "type") {
    const target = normalizePowerShellPath(cwd, commandTarget(args));
    const entry = state.entries[target];
    if (entry?.type !== "file") {
      return { items: [], stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1 };
    }
    return {
      items: entry.content.split(/\r\n|\r|\n/).filter(Boolean).map((line) => ({ text: line, content: line })),
      stderr: "",
      exitCode: 0,
    };
  }

  if (command === "where-object" || command === "where") {
    if (args.length < 3) {
      return { items: [], stderr: "Where-Object requires a property, operator, and comparison value in the virtual PowerShell environment.\n", exitCode: 1 };
    }
    const [property, operator, ...expectedParts] = args;
    const expected = expectedParts.join(" ");
    const filtered = inputItems.filter((item) => {
      const value = itemValue(item, property);
      if (operator.toLowerCase() === "-like") {
        return wildcardToRegExp(expected).test(value);
      }
      if (operator.toLowerCase() === "-eq") {
        return value.toLowerCase() === expected.toLowerCase();
      }
      return false;
    });
    return { items: filtered, stderr: "", exitCode: 0 };
  }

  if (command === "select-object" || command === "select") {
    const property = args[0] === "-ExpandProperty" ? args[1] : args[0];
    if (!property) {
      return { items: [], stderr: "Select-Object requires a property in the virtual PowerShell environment.\n", exitCode: 1 };
    }
    return {
      items: inputItems.map((item) => {
        const text = itemValue(item, property);
        return { ...item, text };
      }),
      stderr: "",
      exitCode: 0,
    };
  }

  if (command === "measure-object" || command === "measure") {
    return { items: [{ text: `Count: ${inputItems.length}` }], stderr: "", exitCode: 0 };
  }

  return { items: [], stderr: `${commandLine}: The term is not recognized in the virtual PowerShell pipeline.\n`, exitCode: 1 };
}

function runPowerShellPipeline(state: VirtualPowerShellState, commandLine: string): VirtualPowerShellResult {
  const nextState = withHistory(state, commandLine.trim());
  let items: PipelineItem[] = [];

  for (const segment of splitPipeline(commandLine)) {
    const result = evaluatePipelineCommand(nextState, nextState.cwd, segment, items);
    if (result.exitCode !== 0) {
      return { stdout: "", stderr: result.stderr, exitCode: result.exitCode, state: nextState };
    }
    items = result.items;
  }

  return { stdout: formatPipelineItems(items), stderr: "", exitCode: 0, state: nextState };
}

export function runPowerShellLine(state: VirtualPowerShellState, commandLine: string): VirtualPowerShellResult {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { stdout: "", stderr: "", exitCode: 0, state };
  }

  if (splitPipeline(trimmed).length > 1) {
    return runPowerShellPipeline(state, trimmed);
  }

  const nextState = withHistory(state, trimmed);
  const { command, args } = parsePowerShellLine(trimmed);

  if (command === "get-help" || command === "help") {
    return {
      stdout: "Supported commands: Get-ChildItem, Set-Location, Get-Location, Get-Content, Write-Output, Where-Object, Select-Object, Measure-Object, New-Item, Set-Content, Copy-Item, Move-Item, Remove-Item, Get-Help, Clear-Host, Get-History\n",
      stderr: "",
      exitCode: 0,
      state: nextState,
    };
  }

  if (command === "clear-host" || command === "cls") {
    return { stdout: "", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "write-output" || command === "echo") {
    return { stdout: args.join(" ") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-history" || command === "history") {
    return { stdout: nextState.history.map((entry, index) => `${index + 1}  ${entry}`).join("\n") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-location" || command === "pwd") {
    return { stdout: nextState.cwd + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "set-location" || command === "cd") {
    const targetArg = commandTarget(args);
    if (!targetArg) {
      return { stdout: nextState.cwd + "\n", stderr: "", exitCode: 0, state: nextState };
    }
    const target = normalizePowerShellPath(nextState.cwd, targetArg);
    if (nextState.entries[target]?.type !== "directory") {
      return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    return { stdout: "", stderr: "", exitCode: 0, state: { ...nextState, cwd: target } };
  }

  if (command === "get-childitem" || command === "ls" || command === "dir") {
    const target = commandTarget(args);
    const result = getChildItems(nextState, nextState.cwd, target);
    if (result.error) {
      return { stdout: "", stderr: result.error, exitCode: 1, state: nextState };
    }
    const directory = target ? normalizePowerShellPath(nextState.cwd, target) : nextState.cwd;
    const lines = result.items.map((item) => (item.entryType === "directory" ? `d---- ${item.name}` : `-a--- ${item.name}`));
    return { stdout: `Directory: ${directory}\n\nMode  Name\n${lines.join("\n")}${lines.length > 0 ? "\n" : ""}`, stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-content" || command === "cat" || command === "type") {
    const targetArg = commandTarget(args);
    const target = normalizePowerShellPath(nextState.cwd, targetArg);
    const entry = nextState.entries[target];
    if (entry?.type !== "file") {
      return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    return { stdout: entry.content, stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "new-item") {
    const target = resolvePathArgument(nextState.cwd, args, 0);
    if (!target) {
      return { stdout: "", stderr: "New-Item requires a path in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    if (!ensureParentDirectory(nextState, target)) {
      return { stdout: "", stderr: `Cannot find path '${parentPath(target)}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    const itemType = (getParameter(args, "ItemType") ?? "File").toLowerCase();
    if (itemType !== "file" && itemType !== "directory") {
      return { stdout: "", stderr: "New-Item supports only File and Directory in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    const entries = {
      ...nextState.entries,
      [target]: itemType === "directory" ? { type: "directory" as const } : { type: "file" as const, content: "" },
    };
    return { stdout: "", stderr: "", exitCode: 0, state: { ...nextState, entries } };
  }

  if (command === "set-content") {
    const target = resolvePathArgument(nextState.cwd, args, 0);
    if (!target) {
      return { stdout: "", stderr: "Set-Content requires a path in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    if (!ensureParentDirectory(nextState, target)) {
      return { stdout: "", stderr: `Cannot find path '${parentPath(target)}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    if (nextState.entries[target]?.type === "directory") {
      return { stdout: "", stderr: `Cannot write file content to directory '${target}' in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    const value = getParameter(args, "Value") ?? positionalArgs(args)[1] ?? "";
    return {
      stdout: "",
      stderr: "",
      exitCode: 0,
      state: { ...nextState, entries: { ...nextState.entries, [target]: { type: "file", content: `${value}\n` } } },
    };
  }

  if (command === "copy-item") {
    const source = resolvePathArgument(nextState.cwd, args, 0);
    const target = resolveArgPath(nextState.cwd, args, "Destination", 1);
    if (!source || !target) {
      return { stdout: "", stderr: "Copy-Item requires source and destination paths in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    return copyVirtualEntry(nextState, source, target);
  }

  if (command === "move-item") {
    const source = resolvePathArgument(nextState.cwd, args, 0);
    const target = resolveArgPath(nextState.cwd, args, "Destination", 1);
    if (!source || !target) {
      return { stdout: "", stderr: "Move-Item requires source and destination paths in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    const copied = copyVirtualEntry(nextState, source, target);
    if (copied.exitCode !== 0) {
      return copied;
    }
    return removeVirtualEntry(copied.state, source, true);
  }

  if (command === "remove-item") {
    const target = resolvePathArgument(nextState.cwd, args, 0);
    if (!target) {
      return { stdout: "", stderr: "Remove-Item requires a path in the virtual PowerShell environment.\n", exitCode: 1, state: nextState };
    }
    return removeVirtualEntry(nextState, target, hasSwitch(args, "Recurse"));
  }

  return { stdout: "", stderr: `${commandLine}: The term is not recognized in the virtual PowerShell environment.\n`, exitCode: 1, state: nextState };
}

export function runPowerShellScript(sourceCode: string, initialState = createVirtualPowerShellState()): VirtualPowerShellResult {
  let state = initialState;
  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  for (const line of sourceCode.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    const result = runPowerShellLine(state, line);
    state = result.state;
    stdout += result.stdout;
    stderr += result.stderr;
    if (result.exitCode !== 0) {
      exitCode = result.exitCode;
    }
  }

  return { stdout, stderr, exitCode, state };
}
