import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../Form";
import { Input } from "../Input";

/* ─── Helpers ──────────────────────────────── */

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

function TestForm({
  onSubmit = vi.fn(),
  defaultValues = { name: "", email: "" },
}: {
  onSubmit?: (data: FormData) => void;
  defaultValues?: FormData;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form form={form} onSubmit={onSubmit} data-testid="form">
      <Form.Field control={form.control} name="name" label="Name" required>
        {({ value, onChange, onBlur, ref }) => (
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="Enter name"
          />
        )}
      </Form.Field>

      <Form.Field
        control={form.control}
        name="email"
        label="Email"
        required
        description="Your work email."
      >
        {({ value, onChange, onBlur, ref }) => (
          <Input
            ref={ref}
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="Enter email"
          />
        )}
      </Form.Field>

      <button type="submit">Submit</button>
    </Form>
  );
}

function submitForm() {
  const form = screen.getByTestId("form");
  fireEvent.submit(form);
}

/* ─── Tests ────────────────────────────────── */

describe("Form", () => {
  it("renders a form element", () => {
    const { container } = render(<TestForm />);
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("renders Field labels", () => {
    render(<TestForm />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<TestForm />);
    expect(screen.getByText("Your work email.")).toBeInTheDocument();
  });

  it("renders input elements", () => {
    render(<TestForm />);
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("submits valid data", async () => {
    const handleSubmit = vi.fn();
    render(
      <TestForm
        onSubmit={handleSubmit}
        defaultValues={{ name: "Jane", email: "jane@example.com" }}
      />
    );

    submitForm();

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        { name: "Jane", email: "jane@example.com" },
        expect.anything()
      );
    });
  });

  it("displays Zod validation errors on submit", async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    submitForm();

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("displays email validation error", async () => {
    render(
      <TestForm
        defaultValues={{ name: "Jane", email: "not-an-email" }}
      />
    );

    submitForm();

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("does not call onSubmit when validation fails", async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    submitForm();

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  it("clears errors after fixing input and resubmitting", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    // Trigger validation
    submitForm();
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    // Fix the errors by typing valid data
    const nameInput = screen.getByPlaceholderText("Enter name");
    const emailInput = screen.getByPlaceholderText("Enter email");
    await user.type(nameInput, "Jane");
    await user.type(emailInput, "jane@example.com");

    // Submit again
    submitForm();

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
