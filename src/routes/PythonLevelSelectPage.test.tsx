import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PythonLevelSelectPage } from "./PythonLevelSelectPage";

describe("PythonLevelSelectPage", () => {
  it("links grade 2 and grade 3 while keeping grade 1 planned", () => {
    render(
      <MemoryRouter>
        <PythonLevelSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /2級/ })).toHaveAttribute("href", "/languages/python/grade-2");
    expect(screen.getByRole("link", { name: /3級/ })).toHaveAttribute("href", "/languages/python/grade-3");
    expect(screen.getByText("1級").closest("[aria-disabled='true']")).toBeInTheDocument();
  });
});
