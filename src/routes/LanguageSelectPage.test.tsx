import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageSelectPage } from "./LanguageSelectPage";

describe("LanguageSelectPage", () => {
  it("links available Python, JavaScript, and HTML/CSS languages", () => {
    render(
      <MemoryRouter>
        <LanguageSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Python/ })).toHaveAttribute("href", "/languages/python");
    expect(screen.getByRole("link", { name: /JavaScript/ })).toHaveAttribute("href", "/languages/javascript");
    expect(screen.getByRole("link", { name: /HTML\/CSS/ })).toHaveAttribute("href", "/languages/html-css");
  });
});
