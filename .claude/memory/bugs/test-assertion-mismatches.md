# Test Assertion Color Mismatches

**Created:** 2026-02-10
**Last Updated:** 2026-02-10
**Source:** session
**Confidence:** high
**Tags:** testing, vitest, tailwind, promptinput, bug-fix

## Summary

PromptInput tests had assertion mismatches because the user's custom Tailwind theme uses non-standard color names. Tests must match the actual CSS classes, not assumed defaults.

## Details

### Color Name Mismatches
The user's UI uses semantic Tailwind colors that differ from standard names:
- FULL_SUCCESS → `emerald` (not `green`)
- PARTIAL_SUCCESS → `amber` (not `yellow`)
- FUNNY_FAIL → `orange` (not `purple`) — user changed this post-commit
- Error → `red` (standard)

Tests that check `container?.className.toMatch(/green/)` will fail — must use `/emerald/`.

### Character Entity Mismatch
The error dismiss button renders `&times;` (HTML entity) which produces `×` (U+00D7 MULTIPLICATION SIGN). The test originally used `✕` (U+2715 MULTIPLICATION X) — a visually similar but different Unicode character. Fix: use `/×/` in the regex.

### Loading State
User added random loading messages (array of 5 strings ending with `…`). Test must match `/\.\.\.|…/` to handle both ellipsis formats.

## Lesson
Always read the actual rendered component before writing assertions about class names or text content. User's custom theme may use unexpected Tailwind color names.

## Related
- `frontend/src/components/PromptInput.tsx`
- `frontend/src/components/__tests__/PromptInput.test.tsx`
