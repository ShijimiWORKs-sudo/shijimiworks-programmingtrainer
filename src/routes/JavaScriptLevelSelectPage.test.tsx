import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { JavaScriptLevelSelectPage } from "./JavaScriptLevelSelectPage";

describe("JavaScriptLevelSelectPage", () => {
  it("links grade 1, grade 2, and grade 3", () => {
    render(
      <MemoryRouter>
        <JavaScriptLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /1級/ })).toHaveAttribute("href", "/languages/javascript/grade-1");
    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/javascript/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/javascript/grade-3");
  });
});
