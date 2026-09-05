import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RubyLevelSelectPage } from "./RubyLevelSelectPage";

describe("RubyLevelSelectPage", () => {
  it("links Ruby grade 1, grade 2, and grade 3 levels", () => {
    render(
      <MemoryRouter>
        <RubyLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /1級/ })).toHaveAttribute("href", "/languages/ruby/grade-1");
    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/ruby/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/ruby/grade-3");
  });
});
