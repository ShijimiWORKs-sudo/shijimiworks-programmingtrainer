import type { OutputComparator } from "../../domain/curriculum";

function normalizeLineEndings(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function normalizeOutput(value: string, comparator: OutputComparator) {
  const normalized = normalizeLineEndings(value);

  if (comparator === "exact_text") {
    return normalized;
  }

  if (comparator === "trimmed_text") {
    return normalized.trim();
  }

  return normalized
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => line.length > 0 || index < lines.length - 1)
    .join("\n")
    .trim();
}

export function compareOutput(actual: string, expected: string, comparator: OutputComparator) {
  return normalizeOutput(actual, comparator) === normalizeOutput(expected, comparator);
}
