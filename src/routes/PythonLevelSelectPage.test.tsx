import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PythonLevelSelectPage } from "./PythonLevelSelectPage";

describe("PythonLevelSelectPage", () => {
  it("links grade 1, grade 2, and grade 3", () => {
    render(
      <MemoryRouter>
        <PythonLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /1級/ })).toHaveAttribute("href", "/languages/python/grade-1");
    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/python/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/python/grade-3");
  });
});
