import { routePaths } from "../app/routePaths";
import { javaGrade1Course } from "../content/java/grade-1";
import { JavaCurriculumView } from "./JavaGrade3CurriculumPage";

export function JavaGrade1CurriculumPage() {
  return <JavaCurriculumView course={javaGrade1Course} lessonPath={routePaths.javaGrade1Lesson} />;
}
