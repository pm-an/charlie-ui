import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { RadioGroup } from "../RadioGroup";
import { Field } from "../Field";

describe("RadioGroup", () => {
  const renderGroup = (props: Partial<React.ComponentProps<typeof RadioGroup>> = {}) =>
    render(
      <RadioGroup name="test" value="a" onChange={() => {}} {...props}>
        <RadioGroup.Item value="a" label="Option A" />
        <RadioGroup.Item value="b" label="Option B" />
        <RadioGroup.Item value="c" label="Option C" />
      </RadioGroup>
    );

  describe("rendering", () => {
    it("renders without crashing", () => {
      renderGroup();
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("renders all radio items", () => {
      renderGroup();
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("renders label text for each item", () => {
      renderGroup();
      expect(screen.getByText("Option A")).toBeInTheDocument();
      expect(screen.getByText("Option B")).toBeInTheDocument();
      expect(screen.getByText("Option C")).toBeInTheDocument();
    });

    it("renders group label when provided", () => {
      renderGroup({ label: "Pick one" });
      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("selects the radio matching the value prop", () => {
      renderGroup({ value: "b" });
      expect(screen.getByLabelText("Option B")).toBeChecked();
      expect(screen.getByLabelText("Option A")).not.toBeChecked();
    });

    it("calls onChange when a radio is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGroup({ value: "a", onChange });
      await user.click(screen.getByLabelText("Option B"));
      expect(onChange).toHaveBeenCalledWith("b");
    });

    it("does not call onChange for already selected item", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGroup({ value: "a", onChange });
      await user.click(screen.getByLabelText("Option A"));
      // Native radios don't fire change when clicking already-selected
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("orientation", () => {
    it("renders vertical by default", () => {
      const { container } = renderGroup();
      const itemsContainer = container.querySelector(".flex-col");
      expect(itemsContainer).toBeInTheDocument();
    });

    it("renders horizontal when orientation is horizontal", () => {
      const { container } = renderGroup({ orientation: "horizontal" });
      const itemsContainer = container.querySelector(".flex-row");
      expect(itemsContainer).toBeInTheDocument();
    });
  });

  describe("disabled", () => {
    it("disables all radios when group is disabled", () => {
      renderGroup({ disabled: true });
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("does not call onChange when group is disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGroup({ disabled: true, onChange });
      await user.click(screen.getByLabelText("Option B"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("disables individual item when item disabled prop is set", () => {
      render(
        <RadioGroup name="test" value="a" onChange={() => {}}>
          <RadioGroup.Item value="a" label="Enabled" />
          <RadioGroup.Item value="b" label="Disabled" disabled />
        </RadioGroup>
      );
      expect(screen.getByLabelText("Enabled")).not.toBeDisabled();
      expect(screen.getByLabelText("Disabled")).toBeDisabled();
    });
  });

  describe("error state", () => {
    it("renders error message when error and errorMessage are set", () => {
      renderGroup({ error: true, errorMessage: "Please select an option" });
      expect(screen.getByText("Please select an option")).toBeInTheDocument();
    });

    it("does not render error message when error is false", () => {
      renderGroup({ errorMessage: "Please select an option" });
      expect(
        screen.queryByText("Please select an option")
      ).not.toBeInTheDocument();
    });

    it("sets aria-invalid on radiogroup when error is true", () => {
      renderGroup({ error: true });
      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });
  });

  describe("descriptions", () => {
    it("renders item description text", () => {
      render(
        <RadioGroup name="test" value="a" onChange={() => {}}>
          <RadioGroup.Item
            value="a"
            label="Starter"
            description="Best for personal use"
          />
        </RadioGroup>
      );
      expect(screen.getByText("Best for personal use")).toBeInTheDocument();
    });
  });

  describe("className merging", () => {
    it("merges custom className on the group", () => {
      const { container } = renderGroup({ className: "custom-group" });
      expect(container.querySelector(".custom-group")).toBeInTheDocument();
    });

    it("merges custom className on individual items", () => {
      const { container } = render(
        <RadioGroup name="test" value="a" onChange={() => {}}>
          <RadioGroup.Item
            value="a"
            label="Option A"
            className="custom-item"
          />
        </RadioGroup>
      );
      expect(container.querySelector(".custom-item")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has radiogroup role on the container", () => {
      renderGroup();
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("has radio role on each item", () => {
      renderGroup();
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("sets aria-label from label prop", () => {
      renderGroup({ label: "Contact method" });
      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-label",
        "Contact method"
      );
    });

    it("sets name attribute on all radio inputs", () => {
      renderGroup({ name: "my-group" });
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("name", "my-group");
      });
    });

    it("hidden inputs use sr-only class", () => {
      renderGroup();
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveClass("sr-only");
      });
    });
  });

  describe("context error", () => {
    it("throws when RadioGroup.Item is used outside RadioGroup", () => {
      expect(() => {
        render(<RadioGroup.Item value="solo" label="Orphan" />);
      }).toThrow("RadioGroup.Item must be used within a RadioGroup");
    });
  });

  describe("RadioGroup inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <RadioGroup
            name="test"
            value="a"
            onChange={() => {}}
            label="Own Label"
            error
            errorMessage="Own error"
          >
            <RadioGroup.Item value="a" label="Option A" />
            <RadioGroup.Item value="b" label="Option B" />
          </RadioGroup>
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(
        <RadioGroup
          name="test"
          value="a"
          onChange={() => {}}
          label="Standalone Label"
          error
          errorMessage="Standalone error"
        >
          <RadioGroup.Item value="a" label="Option A" />
        </RadioGroup>
      );
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone error")).toBeInTheDocument();
    });
  });
});
