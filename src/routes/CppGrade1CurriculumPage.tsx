import { routePaths } from "../app/routePaths";
import { cppGrade1Course } from "../content/cpp/grade-1";
import { CppCurriculumView } from "./CppGrade3CurriculumPage";

export function CppGrade1CurriculumPage() {
  return <CppCurriculumView course={cppGrade1Course} lessonPath={routePaths.cppGrade1Lesson} />;
}
