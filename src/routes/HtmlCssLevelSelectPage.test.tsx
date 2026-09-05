import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HtmlCssLevelSelectPage } from "./HtmlCssLevelSelectPage";

describe("HtmlCssLevelSelectPage", () => {
  it("links HTML/CSS grade 1, grade 2, and grade 3", () => {
    render(
      <MemoryRouter>
        <HtmlCssLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /1級/ })).toHaveAttribute("href", "/languages/html-css/grade-1");
    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/html-css/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/html-css/grade-3");
  });
});
