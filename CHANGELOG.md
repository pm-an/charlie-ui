# Changelog

All notable changes to `@charlietogolden/charlie-ui` are documented in this
file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.4] - 2026-05-12

### Security

- Declared `publishConfig.provenance: true` in `package.json` so npm provenance
  attestations are advertised in the manifest (CI already publishes with
  `--provenance`).
- Added `SECURITY.md` with a private vulnerability reporting policy
  (GitHub Security Advisories, 3-day acknowledgement / 30-day fix targets).
- Pinned third-party GitHub Actions in the release workflow to commit SHAs
  (`softprops/action-gh-release`, `actions/checkout`, `actions/setup-node`)
  and set `persist-credentials: false` on checkout.
- Added an OpenSSF Scorecard workflow (`.github/workflows/scorecard.yml`)
  that publishes results weekly to the public Scorecard database.
- Added a CodeQL workflow (`.github/workflows/codeql.yml`) running the
  `security-extended` and `security-and-quality` query suites on push, PR,
  and a weekly schedule.
- Added a Dependency Review workflow (`.github/workflows/dependency-review.yml`)
  that blocks PRs introducing high-severity vulnerabilities or copyleft
  (AGPL/GPL/LGPL) licenses.

### Fixed

- **Subpath exports now resolve.** `@charlietogolden/charlie-ui/button`,
  `/card`, `/input`, and every other subpath in the `exports` map were
  pointing at files (`dist/components/<Name>.mjs`) that the build never
  emitted — Rollup was collapsing all preserved modules into
  `dist/indexNNN.{mjs,cjs}` because `lib.fileName` collided with
  `preserveModules: true`. Rewrote `vite.config.ts` to use a per-format
  `rollupOptions.output[]` array with explicit `entryFileNames` /
  `chunkFileNames`. Any consumer using subpath imports on 0.1.1–0.1.3 was
  hitting `ERR_MODULE_NOT_FOUND`; they will resolve correctly after upgrading.
- Forced emission of `Toggle` and `FormField` as standalone modules — both
  were being inlined into the main entry by Rollup because they are
  side-effect-free re-exports.

### Changed

- Declared `engines.node >= 20.19.0` and a `funding` field in `package.json`.
- Added `CHANGELOG.md` (this file) following Keep a Changelog.

## [0.1.3] - 2026-05-11

- Cleanup pass on package metadata and exports.
- Test fixes.

## [0.1.2] - 2026-05-11

- CI/CD fixes for the release workflow.

## [0.1.1] - 2026-05-11

- First fully working npm publish under the `@charlietogolden` scope.

## [0.1.0]

- Initial public preview. 110+ React components, Tailwind CSS v4 theming,
  seven preset themes, Storybook docs.

[Unreleased]: https://github.com/pm-an/charlie-ui/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/pm-an/charlie-ui/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/pm-an/charlie-ui/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/pm-an/charlie-ui/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/pm-an/charlie-ui/releases/tag/v0.1.1
[0.1.0]: https://github.com/pm-an/charlie-ui/releases/tag/v0.1.0
