import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { useAriaAnnounce } from "../useAriaAnnounce";

function Announcer() {
  const announce = useAriaAnnounce("polite");
  return (
    <button onClick={() => announce("Item added")} data-testid="btn">
      Announce
    </button>
  );
}

describe("useAriaAnnounce", () => {
  afterEach(() => {
    // Clean up injected live regions
    document.getElementById("charlie-aria-live-polite")?.remove();
    document.getElementById("charlie-aria-live-assertive")?.remove();
  });

  it("creates a live region in the DOM", () => {
    render(<Announcer />);
    const region = document.getElementById("charlie-aria-live-polite");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
  });

  it("announces a message", async () => {
    render(<Announcer />);
    const btn = screen.getByTestId("btn");

    act(() => {
      btn.click();
    });

    // Wait for rAF
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(r));
    });

    const region = document.getElementById("charlie-aria-live-polite");
    expect(region?.textContent).toBe("Item added");
  });

  it("uses sr-only styles", () => {
    render(<Announcer />);
    const region = document.getElementById("charlie-aria-live-polite");
    expect(region?.style.position).toBe("absolute");
    expect(region?.style.width).toBe("1px");
    expect(region?.style.height).toBe("1px");
  });
});
