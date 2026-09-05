import { routePaths } from "../app/routePaths";
import { commandGrade1Course } from "../content/command/grade-1";
import { CommandCurriculumView } from "./CommandGrade3CurriculumPage";

export function CommandGrade1CurriculumPage() {
  return <CommandCurriculumView course={commandGrade1Course} lessonPath={routePaths.commandGrade1Lesson} />;
}
