import { routePaths } from "../app/routePaths";
import { commandGrade2Course } from "../content/command/grade-2";
import { CommandCurriculumView } from "./CommandGrade3CurriculumPage";

export function CommandGrade2CurriculumPage() {
  return <CommandCurriculumView course={commandGrade2Course} lessonPath={routePaths.commandGrade2Lesson} />;
}
