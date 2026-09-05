import { routePaths } from "../app/routePaths";
import { rubyGrade2Course } from "../content/ruby/grade-2";
import { RubyCurriculumView } from "./RubyGrade3CurriculumPage";

export function RubyGrade2CurriculumPage() {
  return <RubyCurriculumView course={rubyGrade2Course} lessonPath={routePaths.rubyGrade2Lesson} />;
}
