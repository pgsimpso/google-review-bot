import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("App responsive workflow", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the shortened mobile queue overview without the old fixed action bar", () => {
    mockMatchMedia(true);
    const { container } = render(<App />);

    expect(screen.getByRole("button", { name: /open first review/i })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /^Open review$/i }),
    ).toHaveLength(2);
    expect(container.querySelector(".mobile-action-bar")).toBeNull();
  });

  it("opens the mobile composer sheet instead of inline editing on compact viewports", async () => {
    mockMatchMedia(true);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /edit draft/i })[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to queue/i }),
    ).toBeInTheDocument();
  });

  it("keeps inline editing on desktop viewports", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /edit draft/i })[0]);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /edit response for/i }),
    ).toBeInTheDocument();
  });

  it("shows the focused issue banner when an issue CTA is selected", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /open related reviews/i })[0]);

    expect(screen.getByText(/Showing reviews tied to/i)).toBeInTheDocument();
  });

  it("defaults launch mode to checklist and can switch to goals on compact viewports", async () => {
    mockMatchMedia(true);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Nico Angelo's Italiano/i }));

    expect(screen.getByRole("button", { name: "Checklist" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Goals" }));

    expect(screen.getByText(/Review runway/i)).toBeInTheDocument();
  });

  it("renders the renamed owner escalation action in review cards", () => {
    mockMatchMedia(true);
    render(<App />);

    expect(
      screen.getAllByRole("button", { name: /escalate to owner call/i }).length,
    ).toBeGreaterThan(0);
  });
});
