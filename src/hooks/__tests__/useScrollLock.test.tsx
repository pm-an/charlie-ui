import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useScrollLock } from "../useScrollLock";

function ScrollLockTest({ active }: { active: boolean }) {
  useScrollLock(active);
  return <div>Content</div>;
}

describe("useScrollLock", () => {
  it("sets body overflow to hidden when active", () => {
    render(<ScrollLockTest active={true} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(<ScrollLockTest active={true} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("does not lock scroll when inactive", () => {
    document.body.style.overflow = "";
    render(<ScrollLockTest active={false} />);
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
