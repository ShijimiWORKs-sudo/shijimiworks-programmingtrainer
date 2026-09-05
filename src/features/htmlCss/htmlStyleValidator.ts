import type { Exercise, HtmlStyleRequirement } from "../../domain/curriculum";
import type { TestCaseGradeResult } from "../grading";
import type { HtmlCssFiles } from "./htmlCssProject";

function normalizeCssValue(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function createStyleSheet(css: string) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
  return {
    sheet: style.sheet,
    dispose: () => style.remove(),
  };
}

function selectorMatches(rule: CSSStyleRule, selector: string) {
  return rule.selectorText
    .split(",")
    .map((part) => part.trim())
    .includes(selector);
}

function getDeclaration(rule: CSSStyleRule, property: string) {
  return rule.style.getPropertyValue(property);
}

function findDeclaration(rules: CSSRuleList, requirement: HtmlStyleRequirement): string | undefined {
  for (const rule of Array.from(rules)) {
    if (requirement.kind === "declaration_equals" && rule.type === CSSRule.STYLE_RULE) {
      const styleRule = rule as CSSStyleRule;
      if (selectorMatches(styleRule, requirement.selector)) {
        return getDeclaration(styleRule, requirement.property);
      }
    }

    if (
      requirement.kind === "media_declaration_equals" &&
      rule.type === CSSRule.MEDIA_RULE &&
      normalizeCssValue((rule as CSSMediaRule).conditionText) === normalizeCssValue(requirement.mediaQuery ?? "")
    ) {
      const nestedValue = findDeclaration((rule as CSSMediaRule).cssRules, { ...requirement, kind: "declaration_equals" });
      if (nestedValue !== undefined) {
        return nestedValue;
      }
    }
  }

  return undefined;
}

function createResult(requirement: HtmlStyleRequirement, actualValue: string | undefined): TestCaseGradeResult {
  const passed = normalizeCssValue(actualValue ?? "") === normalizeCssValue(requirement.expectedValue);

  return {
    testCaseId: "style:" + requirement.id,
    order: requirement.order,
    visibility: requirement.visibility,
    passed,
    required: requirement.required,
    stdin: undefined,
    expectedStdout: requirement.visibility === "public" ? requirement.description : undefined,
    actualStdout: requirement.visibility === "public" ? (actualValue ?? "") : "",
    stderr: "",
    status: "success",
    errorType: undefined,
    durationMs: 0,
  };
}

export function gradeHtmlStyleRequirements(exercise: Exercise, files: HtmlCssFiles): TestCaseGradeResult[] {
  const requirements = [...(exercise.styleRequirements ?? [])].sort((a, b) => a.order - b.order);
  const { sheet, dispose } = createStyleSheet(files.css);

  try {
    return requirements.map((requirement) => createResult(requirement, sheet ? findDeclaration(sheet.cssRules, requirement) : undefined));
  } finally {
    dispose();
  }
}
