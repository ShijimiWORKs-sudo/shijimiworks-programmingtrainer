import { describe, expect, it } from "vitest";
import type { Course } from "../../domain/curriculum";
import { gradeCommandVirtualFileSystemExercise } from "../../features/commandSimulator";
import { commandGrade1Course } from "./grade-1";
import { commandGrade2Course } from "./grade-2";
import { commandGrade3Course } from "./grade-3";

const solutions: Record<string, string> = {
  ex_command3_01_create_files_01: "mkdir reports\necho daily summary > reports\\summary.txt",
  ex_command3_02_move_files_01: "copy draft.txt archive\\draft-backup.txt\nmove draft.txt final.txt",
  ex_command3_03_delete_files_01: "del old.tmp\nrmdir scratch",
  ex_command3_04_relative_paths_01: "mkdir work\necho memo ready > work\\memo.txt",
  ex_command3_05_copy_into_directory_01: "copy source.txt archive\\source.txt",
  ex_command3_06_quoted_paths_01: 'mkdir "daily logs"\necho log ready > "daily logs\\today.txt"',
  ex_command3_07_delete_tmp_file_01: "del tmp.txt",
  ex_command3_08_remove_empty_directory_01: "rmdir scratch",
  ex_command3_09_move_to_archive_01: "move todo.txt archive\\todo.txt",
  ex_command3_10_file_workflow_01: "mkdir release\necho done > release\\status.txt",
  ex_command2_01_backup_workflow_01: "mkdir backup\ncopy plan.txt backup\\plan.txt",
  ex_command2_02_rename_cleanup_01: "move draft.log final.log\ndel old.log",
  ex_command2_03_nested_report_01: "echo complete > reports\\daily.txt",
  ex_command2_04_archive_move_01: "move result.txt archive\\result.txt",
  ex_command2_05_empty_directory_cleanup_01: "rmdir scratch",
  ex_command2_06_small_cleanup_project_01: "mkdir release\ncopy notes.txt release\\notes.txt\ndel tmp.txt",
  ex_command1_01_bug_fix_cleanup_01: "move summery.txt summary.txt",
  ex_command1_02_spec_change_release_01: "mkdir release\ncopy app.txt release\\app.txt",
  ex_command1_03_test_oriented_cleanup_01: "del debug.tmp\ndel cache.tmp",
  ex_command1_04_refactor_archive_01: "mkdir archive\nmove jan.txt archive\\jan.txt\nmove feb.txt archive\\feb.txt",
};

function lessonsFor(course: Course) {
  return course.chapters.flatMap((chapter) => chapter.lessons);
}

describe("Command curriculum", () => {
  it("publishes Command grade 3, grade 2, and grade 1 lessons", () => {
    expect(lessonsFor(commandGrade3Course)).toHaveLength(10);
    expect(lessonsFor(commandGrade2Course)).toHaveLength(6);
    expect(lessonsFor(commandGrade1Course)).toHaveLength(4);

    expect(lessonsFor(commandGrade3Course).map((lesson) => lesson.slug)).toEqual([
      "create-files",
      "move-files",
      "delete-files",
      "relative-paths",
      "copy-into-directory",
      "quoted-paths",
      "delete-tmp-file",
      "remove-empty-directory",
      "move-to-archive",
      "file-workflow",
    ]);

    for (const lesson of [...lessonsFor(commandGrade3Course), ...lessonsFor(commandGrade2Course), ...lessonsFor(commandGrade1Course)]) {
      expect(lesson.status).toBe("published");
      expect(lesson.exercises).toHaveLength(1);
    }
  });

  it("keeps every Command file task virtual, gradable, and hidden-safe", () => {
    const exercises = [commandGrade3Course, commandGrade2Course, commandGrade1Course].flatMap((course) =>
      lessonsFor(course).flatMap((lesson) => lesson.exercises)
    );

    expect(exercises).toHaveLength(20);
    for (const exercise of exercises) {
      expect(exercise.gradingMode).toBe("command_virtual_fs");
      expect(exercise.commandEnvironment?.entries.some((entry) => entry.path === "C:\\Users\\student")).toBe(true);
      expect(exercise.commandFileRequirements?.some((requirement) => requirement.visibility === "public")).toBe(true);
      expect(solutions[exercise.id]).toBeTruthy();

      const grade = gradeCommandVirtualFileSystemExercise(exercise, solutions[exercise.id]);

      expect(grade).toMatchObject({ passed: true });
      expect(grade.results.filter((result) => result.visibility === "hidden").every((result) => result.stdin === undefined)).toBe(true);
    }
  });

  it("publishes Command in the main catalog for the P11-03 routing checkpoint", async () => {
    const { languages } = await import("../catalog");
    const command = languages.find((language) => language.id === "lang_command");

    expect(command).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_command_grade_3" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_command_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_command_grade_1" }] },
      ],
    });
  });
});
