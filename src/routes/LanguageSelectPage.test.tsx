import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageSelectPage } from "./LanguageSelectPage";

describe("LanguageSelectPage", () => {
  it("links available Python, C++, Java, JavaScript, HTML/CSS, Ruby, and Command languages", () => {
    render(
      <MemoryRouter>
        <LanguageSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Python/ })).toHaveAttribute("href", "/languages/python");
    expect(screen.getByRole("link", { name: /C\+\+/ })).toHaveAttribute("href", "/languages/cpp");
    expect(screen.getByRole("link", { name: /^JavaAvailable$/ })).toHaveAttribute("href", "/languages/java");
    expect(screen.getByRole("link", { name: /JavaScript/ })).toHaveAttribute("href", "/languages/javascript");
    expect(screen.getByRole("link", { name: /HTML\/CSS/ })).toHaveAttribute("href", "/languages/html-css");
    expect(screen.getByRole("link", { name: /Ruby/ })).toHaveAttribute("href", "/languages/ruby");
    expect(screen.getByRole("link", { name: /Command/ })).toHaveAttribute("href", "/languages/command");
  });

  it("keeps future languages unavailable until their curriculum routes are added", () => {
    render(
      <MemoryRouter>
        <LanguageSelectPage />
      </MemoryRouter>
    );

    expect(screen.getByText("PowerShell")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /PowerShell/ })).not.toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });
});
