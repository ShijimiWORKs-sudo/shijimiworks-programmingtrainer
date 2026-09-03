import { describe, expect, it } from "vitest";
import { compareOutput, normalizeOutput } from "./compare";

describe("output comparators", () => {
  it("compares exact text after normalizing line endings", () => {
    expect(compareOutput("Hello\r\n", "Hello\n", "exact_text")).toBe(true);
    expect(compareOutput("Hello\n", "Hello", "exact_text")).toBe(false);
  });

  it("compares trimmed text", () => {
    expect(compareOutput("  Hello\n", "Hello", "trimmed_text")).toBe(true);
  });

  it("compares normalized lines", () => {
    expect(normalizeOutput("A  \nB\n\n", "normalized_lines")).toBe("A\nB");
    expect(compareOutput("A  \nB\n\n", "A\nB", "normalized_lines")).toBe(true);
  });
});
