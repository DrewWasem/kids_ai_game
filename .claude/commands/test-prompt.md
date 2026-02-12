# /test-prompt — System Prompt Tester

Test a Claude API system prompt with varied inputs and report the JSON parse success rate.

## Usage
`/test-prompt [task-id]` — e.g., `/test-prompt monster-party`

## Steps

1. **Find the system prompt** — Read `src/prompts/$ARGUMENTS.ts` (or the relevant prompt file).

2. **Generate 10 test inputs** covering:
   - 3 full-success inputs (specific, complete descriptions)
   - 3 partial-success inputs (missing key elements)
   - 2 funny-fail inputs (vague or unrelated)
   - 2 edge cases (gibberish, very long, empty-ish)

3. **For each input**, call the Claude API with the system prompt and:
   - Check if response is valid JSON (strip markdown fences first)
   - Check if `success_level` is one of: FULL_SUCCESS, PARTIAL_SUCCESS, FUNNY_FAIL
   - Check if `actions` is an array with 6 or fewer items
   - Check if `narration` exists and is under 25 words
   - Check if all actor/prop names in actions exist in the vocabulary contract

4. **Report results** as a table:
   ```
   Input                              | Parse | Schema | Vocab | Level
   -----------------------------------|-------|--------|-------|------
   "throw a giant cake with balloons" | ✅    | ✅     | ✅    | FULL_SUCCESS
   "party"                            | ✅    | ✅     | ✅    | FUNNY_FAIL
   "asdfasdf"                         | ✅    | ✅     | ✅    | FUNNY_FAIL
   ```

5. **Summary**: X/10 passed all checks. If < 10/10, recommend specific prompt fixes.

## SME Integration

After generating results, consult relevant SMEs for quality review:

1. **Always run:** `/sme prompt-writer "Review these test results for vocabulary compliance and prompt quality: {paste results table}"`
2. **If any FUNNY_FAIL responses exist:** `/sme child-game-design "Review these failure responses for brand voice — are they funny, not mean? {paste FUNNY_FAIL narrations}"`
3. **If creating/modifying prompts for a new task:** `/sme story-writer "Does this prompt produce good comedy? Review the narrations."` + `/sme ece-professor "Are these responses age-appropriate for 7-11?"`

Flag SME concerns in the results summary.

## Goal
100% parse rate. If any input produces unparseable output, the prompt needs fixing before moving on.
