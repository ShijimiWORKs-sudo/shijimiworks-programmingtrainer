import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CommandLevelSelectPage } from "./CommandLevelSelectPage";

describe("CommandLevelSelectPage", () => {
  it("links Command grade 1, grade 2, and grade 3 levels", () => {
    render(
      <MemoryRouter>
        <CommandLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /1級/ })).toHaveAttribute("href", "/languages/command/grade-1");
    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/command/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/command/grade-3");
  });
});
