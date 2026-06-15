import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SlideDeck from "../components/SlideDeck.tsx";

const slides = [
  <div key="1">Slide 1</div>,
  <div key="2">Slide 2</div>,
  <div key="3">Slide 3</div>,
];

const labels = ["First", "Second", "Third"];

function renderDeck() {
  return render(<SlideDeck slides={slides} slideLabels={labels} />);
}

describe("SlideDeck", () => {
  it("renders the first slide by default", () => {
    renderDeck();
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("shows correct slide counter", () => {
    renderDeck();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("next button advances to the next slide", () => {
    renderDeck();
    fireEvent.click(screen.getByText("▶"));
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("prev button goes to the previous slide", () => {
    renderDeck();
    fireEvent.click(screen.getByText("▶"));
    fireEvent.click(screen.getByText("◀"));
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("prev button is disabled on the first slide", () => {
    renderDeck();
    expect(screen.getByText("◀")).toBeDisabled();
  });

  it("next button is disabled on the last slide", () => {
    renderDeck();
    fireEvent.click(screen.getByText("▶"));
    fireEvent.click(screen.getByText("▶"));
    expect(screen.getByText("▶")).toBeDisabled();
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("ArrowRight advances to the next slide", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
  });

  it("ArrowLeft goes to the previous slide", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("Space advances to the next slide", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: " ", keyCode: 32 });
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
  });

  it("Escape toggles overview mode", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByText("Slide-oversikt")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("Slide-oversikt")).not.toBeInTheDocument();
  });

  it("overview shows all slide labels", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("clicking overview item navigates and closes overview", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(screen.getByText("Third"));
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
    expect(screen.queryByText("Slide-oversikt")).not.toBeInTheDocument();
  });

  it("number key in overview navigates to that slide", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "2" });
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.queryByText("Slide-oversikt")).not.toBeInTheDocument();
  });

  it("Escape in overview closes overview without navigating", () => {
    renderDeck();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.queryByText("Slide-oversikt")).not.toBeInTheDocument();
  });

  it("overview btn toggles overview", () => {
    renderDeck();
    fireEvent.click(screen.getByText("⋮⋮"));
    expect(screen.getByText("Slide-oversikt")).toBeInTheDocument();
    fireEvent.click(screen.getByText("⋮⋮"));
    expect(screen.queryByText("Slide-oversikt")).not.toBeInTheDocument();
  });
});
