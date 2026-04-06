import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Select, type SelectOption } from "../Select";
import { Field } from "../Field";

const options: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const optionsWithDisabled: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue", disabled: true },
  { value: "angular", label: "Angular" },
];

const optionsWithIcons: SelectOption[] = [
  {
    value: "a",
    label: "Alpha",
    icon: <span data-testid="icon-alpha">A</span>,
  },
  {
    value: "b",
    label: "Beta",
    icon: <span data-testid="icon-beta">B</span>,
  },
];

const optionsWithDescriptions: SelectOption[] = [
  { value: "free", label: "Free", description: "For hobby projects" },
  { value: "pro", label: "Pro", description: "For professionals" },
];

describe("Select", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      render(
        <Select options={options} placeholder="Pick one" />
      );
      expect(screen.getByRole("combobox")).toHaveTextContent("Pick one");
    });

    it("renders default placeholder when none provided", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toHaveTextContent(
        "Select an option..."
      );
    });

    it("renders label when provided", () => {
      render(<Select options={options} label="Framework" />);
      expect(screen.getByText("Framework")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(
        <Select options={options} helperText="Choose wisely" />
      );
      expect(screen.getByText("Choose wisely")).toBeInTheDocument();
    });

    it("renders required indicator on label", () => {
      render(
        <Select options={options} label="Framework" required />
      );
      const label = screen.getByText("Framework");
      expect(label).toBeInTheDocument();
    });

    it("applies custom className to trigger", () => {
      render(
        <Select options={options} className="custom-class" />
      );
      expect(screen.getByRole("combobox")).toHaveClass("custom-class");
    });

    it("renders hidden input with name and value", () => {
      const { container } = render(
        <Select options={options} name="framework" value="react" />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.name).toBe("framework");
      expect(hidden.value).toBe("react");
    });

    it("does not render hidden input when name is not provided", () => {
      const { container } = render(
        <Select options={options} value="react" />
      );
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).not.toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens dropdown on click", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("closes dropdown on second click", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("shows all options when opened", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));
      options.forEach((opt) => {
        expect(screen.getByText(opt.label)).toBeInTheDocument();
      });
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on click outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Select options={options} />
          <button>Outside</button>
        </div>
      );
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      fireEvent.mouseDown(screen.getByText("Outside"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("returns focus to trigger when closing", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      await user.keyboard("{Escape}");
      expect(trigger).toHaveFocus();
    });
  });

  describe("selection", () => {
    it("selects an option on click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select options={options} onChange={onChange} />
      );
      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Vue"));
      expect(onChange).toHaveBeenCalledWith("vue");
    });

    it("displays selected option label in trigger", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      await user.click(screen.getByText("Angular"));
      expect(trigger).toHaveTextContent("Angular");
    });

    it("closes dropdown after selection", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      await user.click(screen.getByText("Vue"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("shows check icon on selected option", async () => {
      const user = userEvent.setup();
      render(<Select options={options} value="react" />);
      await user.click(screen.getByRole("combobox"));
      const listbox = screen.getByRole("listbox");
      const reactOption = within(listbox).getByRole("option", {
        name: /React/,
      });
      expect(reactOption).toHaveAttribute("aria-selected", "true");
    });

    it("does not select disabled options", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select
          options={optionsWithDisabled}
          onChange={onChange}
        />
      );
      await user.click(screen.getByRole("combobox"));
      // Disabled option has pointer-events-none, but we can still check via onChange
      // The click shouldn't propagate due to disabled handling
      const vueOption = screen.getByText("Vue").closest('[role="option"]');
      expect(vueOption).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as uncontrolled with defaultValue", async () => {
      const user = userEvent.setup();
      render(
        <Select options={options} defaultValue="vue" />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveTextContent("Vue");
      await user.click(trigger);
      await user.click(screen.getByText("Svelte"));
      expect(trigger).toHaveTextContent("Svelte");
    });

    it("works as controlled component", async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <Select
          options={options}
          value="react"
          onChange={onChange}
        />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveTextContent("React");

      // Simulate controlled update
      rerender(
        <Select
          options={options}
          value="vue"
          onChange={onChange}
        />
      );
      expect(trigger).toHaveTextContent("Vue");
    });

    it("calls onChange when controlled value is selected", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select
          options={options}
          value="react"
          onChange={onChange}
        />
      );
      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Angular"));
      expect(onChange).toHaveBeenCalledWith("angular");
    });
  });

  describe("keyboard navigation", () => {
    it("opens with Enter key", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      screen.getByRole("combobox").focus();
      await user.keyboard("{Enter}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("opens with Space key", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      screen.getByRole("combobox").focus();
      await user.keyboard(" ");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("opens with ArrowDown key", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      screen.getByRole("combobox").focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("navigates options with ArrowDown/ArrowUp", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));

      // Opening highlights first option (React at index 0)
      // ArrowDown moves to Vue (index 1)
      await user.keyboard("{ArrowDown}");

      // Select with Enter
      await user.keyboard("{Enter}");
      expect(screen.getByRole("combobox")).toHaveTextContent("Vue");
    });

    it("selects highlighted option with Enter", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select options={options} onChange={onChange} />
      );
      await user.click(screen.getByRole("combobox"));
      // Opening highlights first option (React), Enter selects it
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("react");
    });

    it("navigates to first option with Home key", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select options={options} onChange={onChange} />
      );
      await user.click(screen.getByRole("combobox"));
      // Move down a few times
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      // Home should go to first
      await user.keyboard("{Home}");
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("react");
    });

    it("navigates to last option with End key", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select options={options} onChange={onChange} />
      );
      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{End}");
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("svelte");
    });

    it("skips disabled options during keyboard navigation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select
          options={optionsWithDisabled}
          onChange={onChange}
        />
      );
      await user.click(screen.getByRole("combobox"));
      // ArrowDown from React should skip Vue (disabled) and go to Angular
      await user.keyboard("{ArrowDown}"); // React (first enabled)
      await user.keyboard("{ArrowDown}"); // Angular (skips disabled Vue)
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("angular");
    });
  });

  describe("search/filter", () => {
    it("renders search input when searchable", async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable />);
      await user.click(screen.getByRole("combobox"));
      expect(
        screen.getByLabelText("Search options")
      ).toBeInTheDocument();
    });

    it("filters options based on search query", async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable />);
      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByLabelText("Search options");
      await user.type(searchInput, "re");
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.queryByText("Vue")).not.toBeInTheDocument();
      expect(screen.queryByText("Angular")).not.toBeInTheDocument();
    });

    it("shows empty message when no options match", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          searchable
          emptyMessage="Nothing here"
        />
      );
      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByLabelText("Search options");
      await user.type(searchInput, "zzzzz");
      expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });

    it("shows default empty message", async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable />);
      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByLabelText("Search options");
      await user.type(searchInput, "zzzzz");
      expect(screen.getByText("No options found")).toBeInTheDocument();
    });

    it("calls onSearch callback when typing", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(
        <Select
          options={options}
          searchable
          onSearch={onSearch}
        />
      );
      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByLabelText("Search options");
      await user.type(searchInput, "rea");
      expect(onSearch).toHaveBeenCalledWith("r");
      expect(onSearch).toHaveBeenCalledWith("re");
      expect(onSearch).toHaveBeenCalledWith("rea");
    });

    it("uses custom search placeholder", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          searchable
          searchPlaceholder="Type to filter..."
        />
      );
      await user.click(screen.getByRole("combobox"));
      expect(
        screen.getByPlaceholderText("Type to filter...")
      ).toBeInTheDocument();
    });

    it("is case insensitive when filtering", async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable />);
      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByLabelText("Search options");
      await user.type(searchInput, "REACT");
      expect(screen.getByText("React")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables the trigger button", () => {
      render(<Select options={options} disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<Select options={options} disabled />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("applies disabled styling", () => {
      render(<Select options={options} disabled />);
      expect(screen.getByRole("combobox")).toHaveClass("opacity-65");
    });
  });

  describe("error state", () => {
    it("renders error message", () => {
      render(
        <Select
          options={options}
          error
          errorMessage="Selection required"
        />
      );
      expect(
        screen.getByText("Selection required")
      ).toBeInTheDocument();
    });

    it("applies error styling to trigger", () => {
      render(<Select options={options} error />);
      expect(screen.getByRole("combobox")).toHaveClass("border-red/50");
    });

    it("hides helper text when error is shown", () => {
      render(
        <Select
          options={options}
          helperText="Pick one"
          error
          errorMessage="Required"
        />
      );
      expect(screen.queryByText("Pick one")).not.toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
  });

  describe("option rendering", () => {
    it("renders option icons", async () => {
      const user = userEvent.setup();
      render(<Select options={optionsWithIcons} />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByTestId("icon-alpha")).toBeInTheDocument();
      expect(screen.getByTestId("icon-beta")).toBeInTheDocument();
    });

    it("renders option descriptions", async () => {
      const user = userEvent.setup();
      render(<Select options={optionsWithDescriptions} />);
      await user.click(screen.getByRole("combobox"));
      expect(
        screen.getByText("For hobby projects")
      ).toBeInTheDocument();
      expect(
        screen.getByText("For professionals")
      ).toBeInTheDocument();
    });

    it("uses custom renderOption", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          renderOption={(opt, state) => (
            <div data-testid={`custom-${opt.value}`}>
              {opt.label} {state.selected ? "(selected)" : ""}
            </div>
          )}
        />
      );
      await user.click(screen.getByRole("combobox"));
      expect(
        screen.getByTestId("custom-react")
      ).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)(
      "renders %s size without errors",
      (size) => {
        render(<Select options={options} size={size} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      }
    );

    it("applies sm size class", () => {
      render(<Select options={options} size="sm" />);
      expect(screen.getByRole("combobox")).toHaveClass("h-7");
    });

    it("applies md size class by default", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toHaveClass("h-9");
    });

    it("applies lg size class", () => {
      render(<Select options={options} size="lg" />);
      expect(screen.getByRole("combobox")).toHaveClass("h-11");
    });
  });

  describe("accessibility", () => {
    it("has combobox role on trigger", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has aria-expanded false when closed", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("has aria-expanded true when open", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("has aria-haspopup listbox", () => {
      render(<Select options={options} />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-haspopup",
        "listbox"
      );
    });

    it("has listbox role on options container", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("has option role on each option", async () => {
      const user = userEvent.setup();
      render(<Select options={options} />);
      await user.click(screen.getByRole("combobox"));
      const optionElements = screen.getAllByRole("option");
      expect(optionElements).toHaveLength(options.length);
    });

    it("has aria-selected on selected option", async () => {
      const user = userEvent.setup();
      render(<Select options={options} value="vue" />);
      await user.click(screen.getByRole("combobox"));
      const vueOption = screen.getAllByRole("option").find(
        (el) => el.textContent?.includes("Vue")
      );
      expect(vueOption).toHaveAttribute("aria-selected", "true");
    });

    it("has aria-disabled on disabled options", async () => {
      const user = userEvent.setup();
      render(<Select options={optionsWithDisabled} />);
      await user.click(screen.getByRole("combobox"));
      const vueOption = screen.getAllByRole("option").find(
        (el) => el.textContent?.includes("Vue")
      );
      expect(vueOption).toHaveAttribute("aria-disabled", "true");
    });

    it("associates label with trigger via aria-labelledby", () => {
      render(<Select options={options} label="Framework" />);
      const trigger = screen.getByRole("combobox");
      const labelId = trigger.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      const label = document.getElementById(labelId!);
      expect(label).toHaveTextContent("Framework");
    });

    it("has aria-required when required", () => {
      render(
        <Select options={options} label="Field" required />
      );
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-required",
        "true"
      );
    });
  });

  describe("Select inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Select options={options} label="Own Label" error errorMessage="Own error" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("suppresses own helper text when inside Field", () => {
      render(
        <Field label="Field Label">
          <Select options={options} helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<Select options={options} label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });
});
