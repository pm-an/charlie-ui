import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useEscapeKey } from "../useEscapeKey";

function EscapeTest({ onEscape, active = true }: { onEscape: () => void; active?: boolean }) {
  useEscapeKey(onEscape, active);
  return <div data-testid="container">Press Escape</div>;
}

describe("useEscapeKey", () => {
  it("calls handler on Escape key", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<EscapeTest onEscape={handler} />);

    await user.keyboard("{Escape}");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler for other keys", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<EscapeTest onEscape={handler} />);

    await user.keyboard("{Enter}");
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler when inactive", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<EscapeTest onEscape={handler} active={false} />);

    await user.keyboard("{Escape}");
    expect(handler).not.toHaveBeenCalled();
  });
});
