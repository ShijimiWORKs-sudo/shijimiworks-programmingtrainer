import { routePaths } from "../app/routePaths";
import { javaGrade2Course } from "../content/java/grade-2";
import { JavaCurriculumView } from "./JavaGrade3CurriculumPage";

export function JavaGrade2CurriculumPage() {
  return <JavaCurriculumView course={javaGrade2Course} lessonPath={routePaths.javaGrade2Lesson} />;
}
