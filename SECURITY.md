# Security Policy

## Supported Versions

Charlie UI is pre-1.0. Security fixes ship only against the latest published
minor on npm.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

**Please do not file public GitHub issues for security reports.**

Report vulnerabilities through GitHub's private vulnerability reporting:

→ https://github.com/pm-an/charlie-ui/security/advisories/new

If you cannot use GitHub Security Advisories, email the maintainer with the
subject line `[charlie-ui security]` and we'll coordinate from there.

We aim to acknowledge reports within **3 business days** and to ship a fix or
mitigation within **30 days** of triage for confirmed issues. Critical issues
affecting downstream consumers will be expedited.

## Scope

In scope:

- The published `@charlietogolden/charlie-ui` npm package and its build output.
- The release pipeline (`.github/workflows/release.yml`) and npm provenance
  attestations.
- Any first-party code in this repository under `src/`.

Out of scope:

- Vulnerabilities in transitive dependencies — please report those upstream
  first; we will ship a follow-up pin/update once the upstream advisory is
  public.
- Storybook / dev dependencies and the documentation site (`/storybook`).
- Theoretical XSS in user-supplied content rendered by components: consumers
  are responsible for sanitizing untrusted HTML before passing it as
  `dangerouslySetInnerHTML`, `children`, or similar.

## Supply Chain

- All releases are published from GitHub Actions with **npm provenance**
  enabled — verify with `npm view @charlietogolden/charlie-ui dist-tags` and
  check the sigstore attestation on the package page.
- The package ships only `dist/` (no source, no scripts, no native binaries).
- No `preinstall` / `postinstall` / `install` scripts are declared.

## Acknowledgements

We will credit reporters in the release notes for the fix unless anonymity is
requested.
