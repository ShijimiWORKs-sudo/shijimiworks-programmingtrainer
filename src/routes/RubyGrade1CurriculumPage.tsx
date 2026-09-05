import { routePaths } from "../app/routePaths";
import { rubyGrade1Course } from "../content/ruby/grade-1";
import { RubyCurriculumView } from "./RubyGrade3CurriculumPage";

export function RubyGrade1CurriculumPage() {
  return <RubyCurriculumView course={rubyGrade1Course} lessonPath={routePaths.rubyGrade1Lesson} />;
}
