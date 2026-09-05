import { describe, expect, it } from "vitest";
import { runJavaSource } from "./javaRuntime";

describe("runJavaSource", () => {
  it("runs a Java main method and captures System.out output", async () => {
    const result = await runJavaSource(
      `
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java");
    System.out.println(7 + 5);
  }
}
`,
      ""
    );

    expect(result).toMatchObject({
      status: "success",
      stdout: "Hello Java\n12\n",
      stderr: "",
    });
  });

  it("reads Scanner input in the browser-contained educational runtime", async () => {
    const result = await runJavaSource(
      `
import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String name = scanner.nextLine();
    int score = scanner.nextInt();
    System.out.println(name + ":" + score);
  }
}
`,
      "Aki\n82\n"
    );

    expect(result.stdout).toBe("Aki:82\n");
  });

  it("supports simple static helper methods for future curriculum grading", async () => {
    const result = await runJavaSource(
      `
public class Main {
  public static int doubleNumber(int number) {
    return number * 2;
  }

  public static void main(String[] args) {
    System.out.println(doubleNumber(6));
  }
}
`,
      ""
    );

    expect(result.stdout).toBe("12\n");
  });

  it("reports missing main and JavaScript syntax failures as syntax errors", async () => {
    const missingMain = await runJavaSource("public class Main {}", "");
    const syntaxFailure = await runJavaSource(
      "public class Main { public static void main(String[] args) { int total = ; } }",
      ""
    );

    expect(missingMain).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
    expect(syntaxFailure).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
  });
});
