import { axe, type AxeResults } from "vitest-axe";
import { expect } from "vitest";

/**
 * Run axe-core on a rendered container and assert zero violations.
 *
 * Disables rules that produce false positives in isolated component tests:
 * - `region`: components are rendered without landmarks
 * - `color-contrast`: JSDOM doesn't compute styles (always fails)
 * - `page-has-heading-one`: isolated tests don't have full page structure
 */
export async function expectNoA11yViolations(
  container: HTMLElement
): Promise<AxeResults> {
  const results = await axe(container, {
    rules: {
      region: { enabled: false },
      "color-contrast": { enabled: false },
      "page-has-heading-one": { enabled: false },
    },
  });
  expect(results).toHaveNoViolations();
  return results;
}
