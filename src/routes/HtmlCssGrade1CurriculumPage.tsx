import { routePaths } from "../app/routePaths";
import { htmlCssGrade1Course } from "../content/html-css/grade-1";
import { HtmlCssCurriculumView } from "./HtmlCssGrade3CurriculumPage";

export function HtmlCssGrade1CurriculumPage() {
  return <HtmlCssCurriculumView course={htmlCssGrade1Course} lessonPath={routePaths.htmlCssGrade1Lesson} />;
}
