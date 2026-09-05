import { routePaths } from "../app/routePaths";
import { cppGrade2Course } from "../content/cpp/grade-2";
import { CppCurriculumView } from "./CppGrade3CurriculumPage";

export function CppGrade2CurriculumPage() {
  return <CppCurriculumView course={cppGrade2Course} lessonPath={routePaths.cppGrade2Lesson} />;
}
