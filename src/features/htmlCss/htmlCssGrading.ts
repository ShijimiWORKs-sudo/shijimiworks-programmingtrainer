import type { Exercise } from "../../domain/curriculum";
import type { GradeResult } from "../grading";
import { gradeHtmlDomRequirements, summarizeHtmlCssValidation } from "./htmlDomValidator";
import type { HtmlCssFiles } from "./htmlCssProject";
import { gradeHtmlStyleRequirements } from "./htmlStyleValidator";

export function gradeHtmlCssExercise(exercise: Exercise, files: HtmlCssFiles): GradeResult {
  return summarizeHtmlCssValidation([
    ...gradeHtmlDomRequirements(exercise, files),
    ...gradeHtmlStyleRequirements(exercise, files),
  ]);
}
