import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HtmlCssLevelSelectPage } from "./HtmlCssLevelSelectPage";

describe("HtmlCssLevelSelectPage", () => {
  it("links HTML/CSS grade 3", () => {
    render(
      <MemoryRouter>
        <HtmlCssLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/html-css/grade-3");
  });
});
