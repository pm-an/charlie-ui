import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContactSection } from "../ContactSection";
import type { ContactInfo } from "../ContactSection";

const mockInfo: ContactInfo[] = [
  {
    icon: <span data-testid="mail-icon">M</span>,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: <span data-testid="phone-icon">P</span>,
    label: "Phone",
    value: "+1 (555) 123-4567",
  },
];

describe("ContactSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<ContactSection />);
      expect(container.querySelector("[data-slot='contact-section']")).toBeInTheDocument();
    });

    it("renders section header when provided", () => {
      render(
        <ContactSection
          eyebrow="Contact"
          title="Get in touch"
          description="We are here to help."
        />
      );
      expect(screen.getByText("Contact")).toBeInTheDocument();
      expect(screen.getByText("Get in touch")).toBeInTheDocument();
      expect(screen.getByText("We are here to help.")).toBeInTheDocument();
    });

    it("does not render header when no header props provided", () => {
      const { container } = render(<ContactSection />);
      expect(container.querySelector("h2")).not.toBeInTheDocument();
    });

    it("renders form fields", () => {
      render(<ContactSection />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<ContactSection />);
      expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(<ContactSection className="custom-cls" />);
      expect(container.firstChild).toHaveClass("custom-cls");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<ContactSection ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<ContactSection data-testid="contact" aria-label="Contact form" />);
      expect(screen.getByTestId("contact")).toBeInTheDocument();
      expect(screen.getByLabelText("Contact form")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<ContactSection />);
      expect(container.firstChild).toHaveAttribute("data-slot", "contact-section");
    });
  });

  describe("variants", () => {
    it("renders split layout by default with info items", () => {
      render(<ContactSection variant="split" info={mockInfo} />);
      expect(screen.getByText("hello@example.com")).toBeInTheDocument();
      expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
    });

    it("renders simple layout centered", () => {
      const { container } = render(<ContactSection variant="simple" title="Contact" />);
      // Simple variant centers the header text
      const headerDiv = container.querySelector(".text-center");
      expect(headerDiv).toBeInTheDocument();
    });

    it("renders info icons in split mode", () => {
      render(<ContactSection variant="split" info={mockInfo} />);
      expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
      expect(screen.getByTestId("phone-icon")).toBeInTheDocument();
    });

    it("renders info value as link when href provided", () => {
      render(<ContactSection variant="split" info={mockInfo} />);
      const link = screen.getByText("hello@example.com");
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "mailto:hello@example.com");
    });

    it("renders info value as text when no href", () => {
      render(<ContactSection variant="split" info={mockInfo} />);
      const text = screen.getByText("+1 (555) 123-4567");
      expect(text.tagName).toBe("P");
    });
  });

  describe("interactions", () => {
    it("calls onSubmit with form data when submitted", () => {
      const onSubmit = vi.fn();
      render(<ContactSection onSubmit={onSubmit} />);

      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Message"), {
        target: { value: "Hello there!" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Send message" }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
      });
    });

    it("updates form fields as user types", () => {
      render(<ContactSection />);

      const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: "Jane" } });
      expect(nameInput.value).toBe("Jane");

      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: "jane@test.com" } });
      expect(emailInput.value).toBe("jane@test.com");

      const messageInput = screen.getByLabelText("Message") as HTMLTextAreaElement;
      fireEvent.change(messageInput, { target: { value: "Hi!" } });
      expect(messageInput.value).toBe("Hi!");
    });

    it("does not crash when no onSubmit provided", () => {
      render(<ContactSection />);
      fireEvent.click(screen.getByRole("button", { name: "Send message" }));
      // No error thrown
    });
  });

  describe("conditional rendering", () => {
    it("does not render info section when no info provided in split mode", () => {
      const { container } = render(<ContactSection variant="split" />);
      // The info section with icon containers should not exist
      expect(container.querySelector("[data-testid='mail-icon']")).not.toBeInTheDocument();
    });

    it("renders form in both variants", () => {
      const { unmount } = render(<ContactSection variant="split" />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      unmount();

      render(<ContactSection variant="simple" />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<ContactSection />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("form fields have associated labels", () => {
      render(<ContactSection />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("email input has correct type", () => {
      render(<ContactSection />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    });

    it("submit button has type submit", () => {
      render(<ContactSection />);
      expect(screen.getByRole("button", { name: "Send message" })).toHaveAttribute(
        "type",
        "submit"
      );
    });
  });
});
