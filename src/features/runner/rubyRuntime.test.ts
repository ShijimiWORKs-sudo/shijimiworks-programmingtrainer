import { describe, expect, it } from "vitest";
import { runRubySource } from "./rubyRuntime";

describe("runRubySource", () => {
  it("runs Ruby puts and captures output", async () => {
    const result = await runRubySource(
      `
puts "Hello Ruby"
puts 7 + 5
`,
      ""
    );

    expect(result).toMatchObject({
      status: "success",
      stdout: "Hello Ruby\n12\n",
      stderr: "",
    });
  });

  it("reads gets input in the browser-contained educational runtime", async () => {
    const result = await runRubySource(
      `
name = gets.chomp
score = gets.to_i
puts "#{name}:#{score}"
`,
      "Aki\n82\n"
    );

    expect(result.stdout).toBe("Aki:82\n");
  });

  it("supports simple functions and conditionals for future curriculum grading", async () => {
    const result = await runRubySource(
      `
def label_score(score)
  if score >= 70
    return "pass"
  else
    return "retry"
  end
end

score = gets.to_i
puts label_score(score)
`,
      "72\n"
    );

    expect(result.stdout).toBe("pass\n");
  });

  it("supports while and for loops", async () => {
    const result = await runRubySource(
      `
total = 0
for number in 1..3
  total = total + number
end

count = 0
while count < 2
  count = count + 1
end

puts total
puts count
`,
      ""
    );

    expect(result.stdout).toBe("6\n2\n");
  });

  it("reports empty source and JavaScript syntax failures as syntax errors", async () => {
    const emptySource = await runRubySource("", "");
    const syntaxFailure = await runRubySource("total =\nputs total", "");

    expect(emptySource).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
    expect(syntaxFailure).toMatchObject({ status: "runtime_error", errorType: "syntax_error" });
  });
});
