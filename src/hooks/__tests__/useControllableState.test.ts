import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useControllableState } from "../useControllableState";

describe("useControllableState", () => {
  it("uses defaultValue when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, "default")
    );
    expect(result.current[0]).toBe("default");
  });

  it("updates internal state when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState<number>(undefined, 0)
    );

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
  });

  it("calls onChange when uncontrolled value changes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, "a", onChange)
    );

    act(() => {
      result.current[1]("b");
    });

    expect(onChange).toHaveBeenCalledWith("b");
    expect(result.current[0]).toBe("b");
  });

  it("uses controlledValue when controlled", () => {
    const { result } = renderHook(() =>
      useControllableState<string>("controlled", "default")
    );
    expect(result.current[0]).toBe("controlled");
  });

  it("does not update internal state when controlled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>("controlled", "default", onChange)
    );

    act(() => {
      result.current[1]("new-value");
    });

    // Value stays at controlled value
    expect(result.current[0]).toBe("controlled");
    // But onChange is still called
    expect(onChange).toHaveBeenCalledWith("new-value");
  });

  it("supports function updater", () => {
    const { result } = renderHook(() =>
      useControllableState<number>(undefined, 10)
    );

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it("supports function updater in controlled mode", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>(10, 0, onChange)
    );

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(onChange).toHaveBeenCalledWith(15);
  });

  it("works with boolean values", () => {
    const { result } = renderHook(() =>
      useControllableState<boolean>(undefined, false)
    );

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it("works with arrays", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string[]>(undefined, [], onChange)
    );

    act(() => {
      result.current[1](["a", "b"]);
    });

    expect(result.current[0]).toEqual(["a", "b"]);
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("reflects updated controlled value on re-render", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<string>(value, "default"),
      { initialProps: { value: "first" as string | undefined } }
    );

    expect(result.current[0]).toBe("first");

    rerender({ value: "second" });
    expect(result.current[0]).toBe("second");
  });

  it("transitions from controlled to uncontrolled gracefully", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<string>(value, "default"),
      { initialProps: { value: "controlled" as string | undefined } }
    );

    expect(result.current[0]).toBe("controlled");

    rerender({ value: undefined });
    // Falls back to internal state (which is still "default")
    expect(result.current[0]).toBe("default");
  });
});
