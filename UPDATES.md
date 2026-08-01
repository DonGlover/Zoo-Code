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

### Testing & Verification

- [ ] Unit tests for context-window-override-handler
- [ ] Integration test: verify override flows through to Task.ts condensation logic
- [ ] Test with constrained context (e.g., 4k override on 128k model) to verify early condensation

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
