import { describe, expect, it } from "vitest";
import { runCppSource } from "./cppRuntime";

describe("runCppSource", () => {
  it("runs a C++ main function and captures cout output", async () => {
    const result = await runCppSource(
      `
#include <iostream>

int main() {
  std::cout << "Hello C++" << std::endl;
  std::cout << 7 + 5 << std::endl;
  return 0;
}
`,
      ""
    );

    expect(result).toMatchObject({
      status: "success",
      stdout: "Hello C++\n12\n",
      stderr: "",
    });
  });

  it("reads cin input in the browser-contained educational runtime", async () => {
    const result = await runCppSource(
      `
#include <iostream>
#include <string>
using namespace std;

int main() {
  string name;
  int score;
  cin >> name >> score;
  cout << name << ":" << score << endl;
  return 0;
}
`,
      "Aki\n82\n"
    );

    expect(result.stdout).toBe("Aki:82\n");
  });

  it("supports simple helper functions for future curriculum grading", async () => {
    const result = await runCppSource(
      `
#include <iostream>

int doubleNumber(int number) {
  return number * 2;
}

int main() {
  std::cout << doubleNumber(6) << std::endl;
  return 0;
}
`,
      ""
    );

    expect(result.stdout).toBe("12\n");
  });

  it("supports array literals for curriculum tasks", async () => {
    const result = await runCppSource(
      `
#include <iostream>
#include <string>
using namespace std;

int main() {
  string first;
  string second;
  string third;
  cin >> first >> second >> third;
  string items[3] = {first, second, third};
  items[1] = "C++";
  cout << items[0] << endl;
  cout << items[1] << endl;
  cout << items[2] << endl;
  return 0;
}
`,
      "red blue green\n"
    );

    expect(result.stdout).toBe("red\nC++\ngreen\n");
  });

  it("reports missing main and JavaScript syntax failures as syntax errors", async () => {
    const missingMain = await runCppSource("int doubleNumber(int number) { return number * 2; }", "");
    const syntaxFailure = await runCppSource("int main() { int total = ; return 0; }", "");

    expect(missingMain).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
    expect(syntaxFailure).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
  });
});
