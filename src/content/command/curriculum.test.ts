import { describe, expect, it } from "vitest";
import { gradeCommandVirtualFileSystemExercise } from "../../features/commandSimulator";
import { commandGrade3Course } from "./grade-3";

const solutions: Record<string, string> = {
  ex_command3_01_create_files_01: "mkdir reports\necho daily summary > reports\\summary.txt",
  ex_command3_02_move_files_01: "copy draft.txt archive\\draft-backup.txt\nmove draft.txt final.txt",
  ex_command3_03_delete_files_01: "del old.tmp\nrmdir scratch",
};

describe("Command curriculum draft", () => {
  it("seeds create, move, and delete virtual filesystem tasks for grade 3", () => {
    const lessons = commandGrade3Course.chapters.flatMap((chapter) => chapter.lessons);

    expect(commandGrade3Course.languageId).toBe("lang_command");
    expect(lessons.map((lesson) => lesson.slug)).toEqual(["create-files", "move-files", "delete-files"]);
    expect(lessons.every((lesson) => lesson.status === "draft")).toBe(true);
  });

  it("keeps every Command file task gradable with public and hidden requirements", () => {
    const exercises = commandGrade3Course.chapters.flatMap((chapter) => chapter.lessons).flatMap((lesson) => lesson.exercises);

    expect(exercises).toHaveLength(3);
    for (const exercise of exercises) {
      expect(exercise.gradingMode).toBe("command_virtual_fs");
      expect(exercise.commandEnvironment?.entries.some((entry) => entry.path === "C:\\Users\\student")).toBe(true);
      expect(exercise.commandFileRequirements?.some((requirement) => requirement.visibility === "public")).toBe(true);
      expect(exercise.commandFileRequirements?.some((requirement) => requirement.visibility === "hidden")).toBe(true);
      expect(gradeCommandVirtualFileSystemExercise(exercise, solutions[exercise.id])).toMatchObject({ passed: true });
    }
  });

  it("does not publish Command in the main catalog before the P11-03 routing checkpoint", async () => {
    const { languages } = await import("../catalog");
    const command = languages.find((language) => language.id === "lang_command");

    expect(command).toMatchObject({ status: "planned", levels: [] });
  });
});
