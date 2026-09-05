import { routePaths } from "../app/routePaths";
import { htmlCssGrade2Course } from "../content/html-css/grade-2";
import { HtmlCssCurriculumView } from "./HtmlCssGrade3CurriculumPage";

export function HtmlCssGrade2CurriculumPage() {
  return <HtmlCssCurriculumView course={htmlCssGrade2Course} lessonPath={routePaths.htmlCssGrade2Lesson} />;
}
