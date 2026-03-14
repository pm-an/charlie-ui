import "vitest";

interface AxeMatchers {
  toHaveNoViolations(): void;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required for module augmentation
  interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required for module augmentation
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
