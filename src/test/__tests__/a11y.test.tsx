import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { expectNoA11yViolations } from "../a11y";

describe("expectNoA11yViolations helper", () => {
  it("passes for accessible HTML", async () => {
    const { container } = render(
      <div>
        <button type="button">Click me</button>
        <label htmlFor="name-input">Name</label>
        <input id="name-input" type="text" />
      </div>
    );
    await expectNoA11yViolations(container);
  });

  it("fails for inaccessible HTML", async () => {
    const { container } = render(
      <div>
        <img />
      </div>
    );
    await expect(expectNoA11yViolations(container)).rejects.toThrow();
  });

  it("ignores the region rule (isolated tests)", async () => {
    const { container } = render(
      <div>
        <h1>Heading</h1>
        <p>Content outside of any landmark</p>
      </div>
    );
    // Would fail if 'region' rule were active
    await expectNoA11yViolations(container);
  });
});
