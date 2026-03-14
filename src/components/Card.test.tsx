import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";
import { expectNoA11yViolations } from "../test/a11y";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn<(node: HTMLDivElement | null) => void>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it.each(["default", "translucent", "outline"] as const)(
    "renders %s variant",
    (variant) => {
      render(<Card variant={variant}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    }
  );

  it.each(["none", "default"] as const)(
    "renders %s padding variant",
    (padding) => {
      render(<Card padding={padding}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    const { container } = render(<Card className="my-card">C</Card>);
    expect(container.firstChild).toHaveClass("my-card");
  });
});

describe("Card.Header", () => {
  it("renders title", () => {
    render(
      <Card>
        <Card.Header title="My Title" />
      </Card>
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <Card>
        <Card.Header title="T" description="My description" />
      </Card>
    );
    expect(screen.getByText("My description")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <Card>
        <Card.Header icon={<span data-testid="icon" />} title="T" />
      </Card>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders children alongside title", () => {
    render(
      <Card>
        <Card.Header title="T">
          <span data-testid="extra">Extra</span>
        </Card.Header>
      </Card>
    );
    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });
});

describe("Card.Body", () => {
  it("renders children", () => {
    render(
      <Card>
        <Card.Body>Body content</Card.Body>
      </Card>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});

describe("Card.Footer", () => {
  it("renders children", () => {
    render(
      <Card>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });
});

describe("Card a11y", () => {
  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <Card>
        <Card.Header title="Card Title" description="Description" />
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    await expectNoA11yViolations(container);
  });
});
