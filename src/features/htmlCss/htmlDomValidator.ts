import type { Exercise, HtmlDomRequirement } from "../../domain/curriculum";
import type { GradeResult, TestCaseGradeResult } from "../grading";
import type { HtmlCssFiles } from "./htmlCssProject";

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function createDocument(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

function evaluateRequirement(document: Document, requirement: HtmlDomRequirement) {
  const elements = Array.from(document.querySelectorAll(requirement.selector));
  const firstElement = elements[0];

  if (requirement.kind === "selector_exists") {
    const minimumCount = requirement.minCount ?? 1;
    return {
      passed: elements.length >= minimumCount,
      actual: `${elements.length} element(s) matched ${requirement.selector}`,
    };
  }

  if (!firstElement) {
    return {
      passed: false,
      actual: `No element matched ${requirement.selector}`,
    };
  }

  if (requirement.kind === "text_includes") {
    const actualText = normalizeText(firstElement.textContent ?? "");
    return {
      passed: typeof requirement.expectedText === "string" && actualText.includes(requirement.expectedText),
      actual: actualText,
    };
  }

  const actualValue = firstElement.getAttribute(requirement.attributeName ?? "") ?? "";
  return {
    passed: typeof requirement.expectedValue === "string" && actualValue === requirement.expectedValue,
    actual: actualValue,
  };
}

function createResult(requirement: HtmlDomRequirement, document: Document): TestCaseGradeResult {
  const evaluated = evaluateRequirement(document, requirement);
  const actualStdout = requirement.visibility === "public" ? evaluated.actual : "";

  return {
    testCaseId: "dom:" + requirement.id,
    order: requirement.order,
    visibility: requirement.visibility,
    passed: evaluated.passed,
    required: requirement.required,
    stdin: undefined,
    expectedStdout: requirement.visibility === "public" ? requirement.description : undefined,
    actualStdout,
    stderr: "",
    status: "success",
    errorType: undefined,
    durationMs: 0,
  };
}

export function gradeHtmlDomExercise(exercise: Exercise, files: HtmlCssFiles): GradeResult {
  const requirements = [...(exercise.domRequirements ?? [])].sort((a, b) => a.order - b.order);
  const document = createDocument(files.html);
  const results = requirements.map((requirement) => createResult(requirement, document));
  const requiredResults = results.filter((result) => result.required);
  const passedRequired = requiredResults.filter((result) => result.passed).length;

  return {
    passed: requiredResults.length > 0 && passedRequired === requiredResults.length,
    totalRequired: requiredResults.length,
    passedRequired,
    results,
  };
}
