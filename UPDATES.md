# Zoo Code Updates & Roadmap

## Completed

### Context Window Override (2026-07-29)

**Status:** ✅ Implemented & Tested

- Added generic `modelContextWindow` field to all provider settings (baseProviderSettingsSchema)
- Created `ContextWindowOverrideHandler` wrapper that applies override to all providers without per-provider changes
- Frontend UI control (`ModelContextWindowControl`) mounted in Advanced Settings
- Override applies to:
    - Progress bar display (useSelectedModel hook)
    - Token budget calculations (getModel().info.contextWindow)
    - Auto-condense/truncation thresholds
    - Output token clamping (20% of context calculation)
- **Why:** Users on constrained deployments (quantized local models, throttled API tiers, reduced Ollama num_ctx) can now override advertised context window
- **Files changed:** 7 files (schema, handler, UI, hooks, i18n)
- **Testing:** Verified override applies to both UI progress bar and backend logic

### Tool Requirement Mode-Specific Fix (2026-07-29)

**Status:** ✅ Implemented & Tested

- Removed blanket "must call at least one tool per response" requirement from all modes
- Made tool requirement conditional: only enforced for Code and Architect modes
- Generic mode now responds naturally to casual requests without forcing tool exploration
- **Why:** Generic mode should support casual tasks (writing, research) without forcing tool calls; Code/Architect modes need tools to function properly
- **Files changed:** 2 files (tool-use.ts, system.ts)
- **Testing:** Generic mode "say hello" now responds naturally; creative tasks (write story) work smoothly

---

## Planned

### Usability Improvements

- [ ] Better context window feedback when approaching limits
- [ ] Visual indicator when override is active

### Generic-First Extension (Future Exploration)

- [ ] Design "lean toolkit" — simplified versions of read_file, write_file, search_files
- [ ] Generic-first mode system (Chat, Write, Research, Analyze — or similar)
- [ ] Usability polish for non-coding workflows
- [ ] Model selection as priority UX improvement

### Testing & Polish (Before Upstreaming)

**Goal:** Ensure feature is solid, well-integrated, and doesn't appear grafted on.

#### Testing

- [ ] Unit tests for context-window-override-handler (foundation)
- [ ] Integration tests: verify override flows through to Task.ts condensation logic
- [ ] Edge case testing:
    - [ ] 4k override on 128k model (verify early condensation triggers)
    - [ ] Override value of 0 (should be ignored)
    - [ ] Negative values (should be rejected)
    - [ ] Override larger than model's actual max (should clamp or warn)
- [ ] Test across provider types:
    - [ ] Static models (Anthropic, Bedrock, etc.)
    - [ ] Dynamic providers (OpenRouter, LiteLLM, etc.)
    - [ ] Local providers (Ollama, LM Studio)
    - [ ] Router providers (zoo-gateway, kimi-code) — auth-scoped providers
    - [ ] Different model families (Claude, Qwen, Gemma, etc.)
- [ ] Router provider metadata interaction (from Zoo Code PR #1053):
    - [ ] Override applies correctly before ensureModelFetched() (hardcoded defaults)
    - [ ] Override still applies after ensureModelFetched() (real metadata)
    - [ ] No stale metadata issues across multiple requests
    - [ ] Verify ContextWindowOverrideHandler doesn't conflict with RouterProvider's ensureModelFetched()

#### Polish & Integration

- [ ] UI error handling (invalid input, out-of-range values)
- [ ] Help text clarity (what "override" means, when to use it)
- [ ] Visual feedback (highlight active override in UI)
- [ ] Code consistency (follows Zoo Code patterns, no obvious seams)
- [ ] Documentation:
    - [ ] Inline code comments explaining the design
    - [ ] README or guide on when/why to use the override
    - [ ] Commit message captures design decisions
- [ ] Performance check (no noticeable lag when setting/changing override)
- [ ] Backward compatibility (works with existing saved settings)

### Token Efficiency (Ongoing)

- Context: ~9.5k for generic mode greeting
- Target: Further optimization for small models (24K-130K context)
- Current: System prompt ~2.1k, environment details ~800-1500k (variable)
- Opportunity: Conditional environment-details verbosity based on context size

---

## Known Issues / Observations

- Generic mode explores workspace on simple queries (by design — it prepares context for tasks)
- Tool requirement removal means Code mode relies on ask_followup_question fallback when no tool fits
- Context window override doesn't affect Bedrock's `awsModelContextWindow` or Ollama's `ollamaNumCtx` (they take precedence, which is correct)

---

## Notes

- Context window override is provider-agnostic: works for all ~25 providers
- No per-provider file changes needed for override to work
- Generic mode creative interpretation of requests (e.g., "raccons" → sci-fi story) is a feature, not a bug
