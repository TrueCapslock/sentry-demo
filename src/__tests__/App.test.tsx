import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App.tsx";

describe("App", () => {
  it("renders the first slide with title", () => {
    render(<App />);
    expect(screen.getByText("Applikasjonsovervåking")).toBeInTheDocument();
  });

  it("shows slide counter", () => {
    render(<App />);
    expect(screen.getByText("1 / 9")).toBeInTheDocument();
  });
});
