# Xiaoyu Retro Redesign + Story Subroute Plan

## TL;DR

> **Quick Summary**: Redesign `/cat/xiaoyu` into a retro Meowdows95-style visual page inspired by `references/cat6.html`, remove current complex interactions, and add a real child route `/cat/xiaoyu/story`.
>
> **Deliverables**:
>
> - New design-focused Xiaoyu main page (`/cat/xiaoyu`)
> - New Xiaoyu story subpage (`/cat/xiaoyu/story`)
> - Route registration and navigation linkage
> - p5 atmospheric background integrated with retro window layout
> - Post-implementation automated tests
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: T1 -> T3 -> T8 -> T10

---

## Context

### Original Request

User requested Xiaoyu-only redesign with theme reference `references/cat6.html`, explicitly requiring a real child route page (example `/cat/xiaoyu/story`). Other cats are excluded and will be designed later with different themes.

### Interview Summary

**Key Discussions**:

- Keep scope strictly to Xiaoyu.
- Remove current heavy interactions on Xiaoyu page (design-first focus).
- Use p5.js for visual atmosphere.
- Add a true child route page for Xiaoyu.
- Testing strategy chosen: **tests after implementation**.

**Research Findings**:

- Routes are declared explicitly in `client/src/App.tsx` using `wouter` `<Route>` entries.
- Current Xiaoyu page (`client/src/pages/cats/CatXiaoyu.tsx`) is interaction-heavy and visually divergent from reference style.
- Test dependencies exist (`vitest`, `@playwright/test`) but no test scripts/files currently in active use.

### Metis Review

**Identified Gaps (addressed in this plan)**:

- Lock down anti-scope-creep guardrails to avoid touching other cat pages.
- Define explicit child-route behavior and direct-access expectations.
- Add executable acceptance criteria (no manual-only verification).
- Include post-implementation test setup task because tests are required but infra is partial.

---

## Work Objectives

### Core Objective

Deliver a visually strong Xiaoyu page system with retro floating-window aesthetics and p5 atmospheric animation, plus a production-ready subroute `/cat/xiaoyu/story`, while preserving project stability and route integrity.

### Concrete Deliverables

- `client/src/pages/cats/CatXiaoyu.tsx` redesigned to Meowdows95-inspired layout.
- New `client/src/pages/cats/CatXiaoyuStory.tsx` (story child page).
- Updated `client/src/App.tsx` route declarations to include `/cat/xiaoyu/story`.
- In-page navigation between Xiaoyu main and story subpage.
- Test setup updates and route/render tests for Xiaoyu pages.

### Definition of Done

- [ ] `pnpm run build` exits with code 0.
- [ ] Visiting `/cat/xiaoyu` renders redesigned retro layout with p5 background.
- [ ] Visiting `/cat/xiaoyu/story` directly returns 200 and renders story page.
- [ ] Navigation between `/cat/xiaoyu` and `/cat/xiaoyu/story` works both click + browser back.
- [ ] Post-implementation tests execute via configured script and pass.

### Must Have

- Xiaoyu-only redesign aligned to `references/cat6.html` visual language.
- Real child route page (`/cat/xiaoyu/story`).
- p5 atmospheric animation on Xiaoyu pages.
- Removal of current heavy interactive mechanics from Xiaoyu main page.
- Tests added after implementation.

### Must NOT Have (Guardrails)

- No redesign work in non-Xiaoyu pages: `CatXueqiu`, `CatMomo`, `CatTiaowen`, `CatBuding`, `CatHuahua`.
- No changes to Home or Family visual design.
- No global style-system overhaul outside what Xiaoyu pages require.
- No speculative abstraction for all future cats.
- No acceptance criteria requiring manual-only verification.

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: PARTIAL (deps installed, scripts/tests absent)
- **Automated tests**: Tests-after
- **Framework**: Vitest + Playwright (configured in this plan)

### QA Policy

Evidence files stored under `.sisyphus/evidence/`.

- **Frontend/UI**: Playwright for route and DOM assertions + screenshot evidence.
- **Route/API-like check**: Bash + curl for direct route status.
- **Build/type safety**: `pnpm run check` and `pnpm run build`.

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately - architecture + scaffolding):

- T1: Route and dependency mapping for Xiaoyu pages [quick]
- T2: Design token extraction from reference and local style constraints [visual-engineering]
- T3: Create Xiaoyu story page scaffold and content architecture [visual-engineering]
- T4: p5 background architecture decision and wrapper implementation [visual-engineering]
- T5: Test harness bootstrap (scripts + base config for tests-after) [quick]

Wave 2 (After Wave 1 - main implementation, max parallel):

- T6: Redesign `/cat/xiaoyu` retro window layout (non-interactive) [visual-engineering]
- T7: Implement `/cat/xiaoyu/story` final visual page and narrative sections [visual-engineering]
- T8: Route wiring in `App.tsx` + page-to-page navigation [quick]
- T9: Integrate p5 atmospheric animation with readability-safe layering [visual-engineering]
- T10: Automated tests for route/navigation/render and direct access [unspecified-high]

Wave 3 (After Wave 2 - stabilization):

- T11: Regression check to guarantee non-Xiaoyu pages unchanged behavior [quick]
- T12: Build/typecheck and QA evidence consolidation [quick]

Wave FINAL (After ALL tasks - independent review, 4 parallel):

- F1: Plan compliance audit (oracle)
- F2: Code quality review (unspecified-high)
- F3: Real manual QA execution from scripted scenarios (unspecified-high)
- F4: Scope fidelity check (deep)

Critical Path: T1 -> T3 -> T8 -> T10 -> T12 -> F1-F4
Parallel Speedup: ~55%
Max Concurrent: 5

### Dependency Matrix (full)

- T1: Blocked By none -> Blocks T6, T8, T11
- T2: Blocked By none -> Blocks T6, T7, T9
- T3: Blocked By none -> Blocks T7, T8
- T4: Blocked By none -> Blocks T9
- T5: Blocked By none -> Blocks T10
- T6: Blocked By T1, T2 -> Blocks T9, T12
- T7: Blocked By T2, T3 -> Blocks T8, T12
- T8: Blocked By T1, T3, T7 -> Blocks T10, T12
- T9: Blocked By T2, T4, T6 -> Blocks T12
- T10: Blocked By T5, T8 -> Blocks T12
- T11: Blocked By T1, T8 -> Blocks T12
- T12: Blocked By T6, T7, T8, T9, T10, T11 -> Blocks FINAL

### Agent Dispatch Summary

- Wave 1: T1 `quick`, T2 `visual-engineering`, T3 `visual-engineering`, T4 `visual-engineering`, T5 `quick`
- Wave 2: T6 `visual-engineering`, T7 `visual-engineering`, T8 `quick`, T9 `visual-engineering`, T10 `unspecified-high`
- Wave 3: T11 `quick`, T12 `quick`
- FINAL: F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [ ] 1. Route and Xiaoyu dependency map lock

  **What to do**:
  - Identify all files that reference `/cat/xiaoyu` and `CatXiaoyu`.
  - Record route insertion point in `client/src/App.tsx`.
  - Confirm no required edits in non-Xiaoyu cat pages.

  **Must NOT do**:
  - Do not edit any non-Xiaoyu cat page.

  **Recommended Agent Profile**:
  - **Category**: `quick` - fast codebase mapping and path verification
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T6, T8, T11
  - **Blocked By**: None

  **References**:
  - `client/src/App.tsx` - source of truth for route registration order.
  - `client/src/pages/cats/CatXiaoyu.tsx` - current page to be redesigned.
  - `client/src/lib/cats.ts` - authoritative Xiaoyu data source.

  **Acceptance Criteria**:
  - [ ] Route/dependency map artifact created in evidence notes.
  - [ ] Confirmed no non-Xiaoyu page dependency edits needed.

  **QA Scenarios**:

  ```
  Scenario: Route map generation
    Tool: Bash
    Preconditions: Repo indexed
    Steps:
      1. Search for '/cat/xiaoyu' and 'CatXiaoyu' usages.
      2. Save list to .sisyphus/evidence/task-1-route-map.txt.
      3. Assert only expected files are listed.
    Expected Result: Deterministic map with App.tsx and Xiaoyu files
    Failure Indicators: Unexpected cross-cat dependencies
    Evidence: .sisyphus/evidence/task-1-route-map.txt

  Scenario: Negative scope check
    Tool: Bash
    Preconditions: same
    Steps:
      1. Search for planned edit markers in non-Xiaoyu cat files.
      2. Assert no required changes are identified.
    Expected Result: Non-Xiaoyu files untouched for implementation scope
    Evidence: .sisyphus/evidence/task-1-scope-check.txt
  ```

- [ ] 2. Visual token and layout blueprint extraction

  **What to do**:
  - Extract reusable design primitives from `references/cat6.html` (window shell, title bar, controls, grain layer).
  - Translate into Xiaoyu-scoped design token list.

  **Must NOT do**:
  - No global theme rewrite.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T6, T7, T9
  - **Blocked By**: None

  **References**:
  - `references/cat6.html` - reference aesthetic source.
  - `client/src/pages/cats/CatXiaoyu.tsx` - target replacement constraints.
  - `client/src/index.css` - project-level variable conventions.

  **Acceptance Criteria**:
  - [ ] Blueprint includes typography, spacing, window hierarchy, overlay rules.
  - [ ] Xiaoyu colors mapped from `cats.ts` tokens.

  **QA Scenarios**:

  ```
  Scenario: Blueprint completeness
    Tool: Bash
    Preconditions: reference and target files available
    Steps:
      1. Produce blueprint checklist file.
      2. Verify checklist includes window, grain, p5 layer, story-link area.
    Expected Result: Complete design checklist used by implementation tasks
    Evidence: .sisyphus/evidence/task-2-blueprint.txt

  Scenario: Negative global-impact check
    Tool: Bash
    Preconditions: same
    Steps:
      1. Confirm plan avoids global CSS variable rewrites.
      2. Record explicit local-scope selectors.
    Expected Result: Localized Xiaoyu styles only
    Evidence: .sisyphus/evidence/task-2-scope-guard.txt
  ```

- [ ] 3. Create Xiaoyu story subpage scaffold

  **What to do**:
  - Create `client/src/pages/cats/CatXiaoyuStory.tsx` with narrative sections and retro-window composition.
  - Source base cat metadata via `getCatById("xiaoyu")`.

  **Must NOT do**:
  - Do not include heavy game-like interactions.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T7, T8
  - **Blocked By**: None

  **References**:
  - `client/src/pages/cats/CatXiaoyu.tsx` - existing data usage pattern.
  - `client/src/lib/cats.ts` - xiaoyu description/tags/facts.
  - `references/cat6.html` - window/narrative rhythm.

  **Acceptance Criteria**:
  - [ ] Story page component compiles.
  - [ ] Contains navigation target back to `/cat/xiaoyu`.

  **QA Scenarios**:

  ```
  Scenario: Story page static render
    Tool: Bash
    Preconditions: component created
    Steps:
      1. Run typecheck/build.
      2. Assert no TS/JSX errors from CatXiaoyuStory.
    Expected Result: Component is route-ready and compilable
    Evidence: .sisyphus/evidence/task-3-build-log.txt

  Scenario: Negative interaction check
    Tool: Bash
    Preconditions: component created
    Steps:
      1. Scan for deprecated old interaction states (feedCount/mood toggles) in story file.
      2. Assert absent.
    Expected Result: Story page stays design-focused
    Evidence: .sisyphus/evidence/task-3-interaction-check.txt
  ```

- [ ] 4. Implement Xiaoyu-scoped p5 atmosphere module

  **What to do**:
  - Add or adapt a Xiaoyu-specific p5 background module used by main/story pages.
  - Ensure fixed background layer, low-opacity motion, and cleanup on unmount.

  **Must NOT do**:
  - Do not alter other cat pages to use this module.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T9
  - **Blocked By**: None

  **References**:
  - `client/src/components/ParticleBackground.tsx` - existing p5 component lifecycle pattern.
  - `references/cat6.html` - animated background mood cues.

  **Acceptance Criteria**:
  - [ ] p5 layer renders behind content.
  - [ ] No leaked instance after route changes.

  **QA Scenarios**:

  ```
  Scenario: p5 layer lifecycle
    Tool: Playwright
    Preconditions: page integrated with p5 background
    Steps:
      1. Open /cat/xiaoyu.
      2. Verify canvas exists behind windows (z-index check).
      3. Navigate away and back; verify no duplicate canvas nodes.
    Expected Result: Single canvas instance with proper cleanup
    Evidence: .sisyphus/evidence/task-4-canvas-lifecycle.png

  Scenario: Negative readability check
    Tool: Playwright
    Preconditions: same
    Steps:
      1. Capture screenshot of text-heavy window.
      2. Assert text contrast remains legible.
    Expected Result: Background does not overpower content
    Evidence: .sisyphus/evidence/task-4-readability.png
  ```

- [ ] 5. Bootstrap tests-after harness for Xiaoyu scope

  **What to do**:
  - Add minimal scripts/config so Xiaoyu tests can run after implementation.
  - Keep setup minimal (no CI expansion).

  **Must NOT do**:
  - Do not introduce broad repo-wide test refactor.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T10
  - **Blocked By**: None

  **References**:
  - `package.json` - add test script conventions.
  - existing vite/ts setup files in repo root - align test command compatibility.

  **Acceptance Criteria**:
  - [ ] `pnpm run test:xiaoyu` command exists.
  - [ ] Command executes test runner successfully (may fail before tests are written).

  **QA Scenarios**:

  ```
  Scenario: Test command availability
    Tool: Bash
    Preconditions: package scripts updated
    Steps:
      1. Run pnpm run test:xiaoyu -- --help.
      2. Assert command resolves test runner.
    Expected Result: Script executes runner entrypoint
    Evidence: .sisyphus/evidence/task-5-test-script.txt

  Scenario: Negative CI creep check
    Tool: Bash
    Preconditions: same
    Steps:
      1. Check for new CI workflow files.
      2. Assert none added.
    Expected Result: No unintended CI expansion
    Evidence: .sisyphus/evidence/task-5-ci-check.txt
  ```

- [ ] 6. Redesign `/cat/xiaoyu` into retro-window composition

  **What to do**:
  - Replace current interaction-heavy layout with cat6-inspired floating windows and title bars.
  - Keep content-driven sections (identity, archive, facts) with design-first presentation.

  **Must NOT do**:
  - Do not keep feed/mood/ascii toggles or summon mechanics.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T9, T12
  - **Blocked By**: T1, T2

  **References**:
  - `client/src/pages/cats/CatXiaoyu.tsx` - replacement target.
  - `references/cat6.html` - window shell and desktop composition.
  - `client/src/lib/cats.ts` - xiaoyu data fields to preserve.

  **Acceptance Criteria**:
  - [ ] Main page no longer contains removed interaction states.
  - [ ] Retro window sections render with title bars/control dots.

  **QA Scenarios**:

  ```
  Scenario: Main page visual structure
    Tool: Playwright
    Preconditions: page implemented
    Steps:
      1. Open /cat/xiaoyu.
      2. Assert at least 3 '.window' style containers are visible.
      3. Assert title bar/control elements exist.
    Expected Result: Reference-aligned desktop-window composition
    Evidence: .sisyphus/evidence/task-6-main-layout.png

  Scenario: Removed interaction negative check
    Tool: Playwright
    Preconditions: same
    Steps:
      1. Search DOM for old feed button text and mood labels.
      2. Assert absent.
    Expected Result: Deprecated mechanics removed
    Evidence: .sisyphus/evidence/task-6-removed-interactions.txt
  ```

- [ ] 7. Build final `/cat/xiaoyu/story` visual narrative page

  **What to do**:
  - Complete story subpage with themed windows and timeline-like narrative flow.
  - Include clear CTA/link back to main Xiaoyu page.

  **Must NOT do**:
  - Do not apply this theme to other cats.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T8, T12
  - **Blocked By**: T2, T3

  **References**:
  - `client/src/pages/cats/CatXiaoyuStory.tsx` - story component target.
  - `client/src/lib/cats.ts` - narrative source text and tags.
  - `references/cat6.html` - long-scroll panel pacing.

  **Acceptance Criteria**:
  - [ ] Story page shows distinct narrative sections and Xiaoyu identity.
  - [ ] Link back to `/cat/xiaoyu` works.

  **QA Scenarios**:

  ```
  Scenario: Story page render
    Tool: Playwright
    Preconditions: route wired
    Steps:
      1. Open /cat/xiaoyu/story directly.
      2. Assert primary heading and narrative windows exist.
    Expected Result: Story route renders independently
    Evidence: .sisyphus/evidence/task-7-story-render.png

  Scenario: Negative cross-theme check
    Tool: Bash
    Preconditions: same
    Steps:
      1. Verify no edits in non-Xiaoyu page files from this task.
      2. Record git diff file list.
    Expected Result: Theme remains Xiaoyu-only
    Evidence: .sisyphus/evidence/task-7-scope-files.txt
  ```

- [ ] 8. Wire route and navigation for child page

  **What to do**:
  - Add route entry for `/cat/xiaoyu/story` in `client/src/App.tsx`.
  - Add navigation links between main and story pages.

  **Must NOT do**:
  - Do not alter route behavior for other cats.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T10, T12
  - **Blocked By**: T1, T3, T7

  **References**:
  - `client/src/App.tsx` - route table pattern.
  - `client/src/pages/cats/CatXiaoyu.tsx` - add link to story.
  - `client/src/pages/cats/CatXiaoyuStory.tsx` - add link to main.

  **Acceptance Criteria**:
  - [ ] `/cat/xiaoyu/story` route registered and reachable.
  - [ ] Browser back from story returns to main page.

  **QA Scenarios**:

  ```
  Scenario: Route navigation happy path
    Tool: Playwright
    Preconditions: route wired
    Steps:
      1. Open /cat/xiaoyu.
      2. Click story link selector.
      3. Assert URL ends with /cat/xiaoyu/story.
      4. Execute browser back and assert /cat/xiaoyu.
    Expected Result: Bidirectional navigation works
    Evidence: .sisyphus/evidence/task-8-route-nav.png

  Scenario: Direct-access negative case
    Tool: Bash (curl)
    Preconditions: app running
    Steps:
      1. curl -I http://localhost:3000/cat/xiaoyu/story
      2. Assert status 200 (or app shell success code).
    Expected Result: No 404 for direct child-route access
    Evidence: .sisyphus/evidence/task-8-direct-route.txt
  ```

- [ ] 9. Integrate p5 atmosphere with readability-safe layering

  **What to do**:
  - Hook Xiaoyu p5 background into both main and story pages.
  - Apply grain + blend + z-index rules so text remains legible.

  **Must NOT do**:
  - Do not place canvas above content interaction layer.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12
  - **Blocked By**: T2, T4, T6

  **References**:
  - `client/src/components/ParticleBackground.tsx` - safe canvas lifecycle reference.
  - `client/src/pages/cats/CatXiaoyu.tsx` - main layering target.
  - `client/src/pages/cats/CatXiaoyuStory.tsx` - story layering target.

  **Acceptance Criteria**:
  - [ ] Animation present on both routes.
  - [ ] Foreground text contrast remains acceptable in screenshots.

  **QA Scenarios**:

  ```
  Scenario: Dual-route p5 verification
    Tool: Playwright
    Preconditions: p5 integrated
    Steps:
      1. Capture /cat/xiaoyu screenshot.
      2. Capture /cat/xiaoyu/story screenshot.
      3. Assert canvas present and no overlap over clickable nav.
    Expected Result: Consistent atmosphere on both pages
    Evidence: .sisyphus/evidence/task-9-dual-route-p5.png

  Scenario: Negative z-index layering check
    Tool: Playwright
    Preconditions: same
    Steps:
      1. Query computed z-index for canvas and content container.
      2. Assert content z-index > canvas z-index.
    Expected Result: Readability and interactions preserved
    Evidence: .sisyphus/evidence/task-9-zindex.txt
  ```

- [ ] 10. Add automated tests for Xiaoyu route/render behavior

  **What to do**:
  - Implement tests-after coverage for:
    - main route render
    - story route render
    - click navigation and browser back
    - direct child route access

  **Must NOT do**:
  - Do not expand tests to other cats in this task.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12
  - **Blocked By**: T5, T8

  **References**:
  - `client/src/App.tsx` - asserted route paths.
  - newly added test config/scripts from T5.
  - Xiaoyu main/story page files for selectors.

  **Acceptance Criteria**:
  - [ ] `pnpm run test:xiaoyu` exits 0.
  - [ ] Tests assert both positive and negative route cases.

  **QA Scenarios**:

  ```
  Scenario: Route test suite pass
    Tool: Bash
    Preconditions: tests implemented
    Steps:
      1. Run pnpm run test:xiaoyu.
      2. Capture full output.
    Expected Result: all Xiaoyu tests pass
    Evidence: .sisyphus/evidence/task-10-test-run.txt

  Scenario: Negative path assertion
    Tool: Playwright
    Preconditions: tests implemented
    Steps:
      1. Validate non-existing child path /cat/xiaoyu/unknown behavior.
      2. Assert fallback route behavior (NotFound or equivalent).
    Expected Result: invalid child route handled predictably
    Evidence: .sisyphus/evidence/task-10-negative-route.png
  ```

- [ ] 11. Non-Xiaoyu regression guard

  **What to do**:
  - Verify other cat routes still render and were not visually/theme-modified.
  - Verify Family/Home route behavior is unchanged.

  **Must NOT do**:
  - No opportunistic refactors outside Xiaoyu scope.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T12
  - **Blocked By**: T1, T8

  **References**:
  - `client/src/App.tsx` - route list for regression checks.
  - all non-Xiaoyu page files in `client/src/pages/cats/` for no-change check.

  **Acceptance Criteria**:
  - [ ] Non-Xiaoyu cat routes load successfully.
  - [ ] Diff scope excludes unintended page redesigns.

  **QA Scenarios**:

  ```
  Scenario: Route smoke for non-Xiaoyu pages
    Tool: Playwright
    Preconditions: app running
    Steps:
      1. Visit /cat/xueqiu, /cat/momo, /cat/tiaowen, /cat/buding, /cat/huahua.
      2. Assert each page returns expected heading/hero presence.
    Expected Result: Existing pages unaffected
    Evidence: .sisyphus/evidence/task-11-smoke.png

  Scenario: Negative scope diff check
    Tool: Bash
    Preconditions: implementation complete
    Steps:
      1. Run git diff --name-only.
      2. Assert modified files match planned scope list.
    Expected Result: No accidental redesign spillover
    Evidence: .sisyphus/evidence/task-11-diff-scope.txt
  ```

- [ ] 12. Final stabilize/build and evidence pack

  **What to do**:
  - Run `pnpm run check`, `pnpm run build`, and Xiaoyu test command.
  - Gather all evidence artifacts and summarize pass/fail.

  **Must NOT do**:
  - Do not skip failed checks.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential closer)
  - **Blocks**: FINAL wave
  - **Blocked By**: T6, T7, T8, T9, T10, T11

  **References**:
  - `package.json` scripts for check/build/test execution.
  - `.sisyphus/evidence/` output from all preceding tasks.

  **Acceptance Criteria**:
  - [ ] check/build/test commands all pass.
  - [ ] final evidence index file created.

  **QA Scenarios**:

  ```
  Scenario: Full command gate
    Tool: Bash
    Preconditions: all implementation tasks done
    Steps:
      1. Run pnpm run check.
      2. Run pnpm run build.
      3. Run pnpm run test:xiaoyu.
    Expected Result: all commands exit 0
    Evidence: .sisyphus/evidence/task-12-command-gate.txt

  Scenario: Missing-evidence negative check
    Tool: Bash
    Preconditions: evidence expected from T1-T11
    Steps:
      1. Verify required evidence files exist.
      2. Fail if any mandatory evidence missing.
    Expected Result: complete auditable evidence set
    Evidence: .sisyphus/evidence/task-12-evidence-index.txt
  ```

---

## Final Verification Wave (MANDATORY - after ALL implementation tasks)

- [ ] F1. **Plan Compliance Audit** - `oracle`
      Verify every Must Have/Must NOT Have against final diff and evidence files.

- [ ] F2. **Code Quality Review** - `unspecified-high`
      Run typecheck/build and inspect changed files for risky shortcuts and regression risks.

- [ ] F3. **Real Manual QA** - `unspecified-high`
      Execute all scripted scenarios, capture screenshots/video/log evidence under `.sisyphus/evidence/final-qa/`.

- [ ] F4. **Scope Fidelity Check** - `deep`
      Ensure only Xiaoyu route/page files and required routing/test files changed; reject if cross-cat contamination exists.

---

## Commit Strategy

- C1: `feat(xiaoyu): redesign page in meowdows95 visual style`
- C2: `feat(xiaoyu): add story subroute and navigation`
- C3: `test(xiaoyu): add route and render verification`

---

## Success Criteria

### Verification Commands

```bash
pnpm run check
pnpm run build
pnpm run test:xiaoyu
```

### Final Checklist

- [ ] `/cat/xiaoyu` redesigned per reference language
- [ ] `/cat/xiaoyu/story` exists and is directly accessible
- [ ] Navigation and browser back behavior verified
- [ ] Non-Xiaoyu pages unaffected
- [ ] Automated tests pass
