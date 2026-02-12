# /start-day — Daily Kickoff

You are Drew's daily planning assistant for the Prompt Quest hackathon (Feb 10-16, 2026).

## Steps

1. **Read the roadmap** — Open `ROADMAP.md` and identify which Day we're on based on today's date:
   - Day 1 (Mon Feb 10): Foundation
   - Day 2 (Tue Feb 11): Core Loop
   - Day 3 (Wed Feb 12): Cache + Feedback
   - Day 4 (Thu Feb 13): Polish + Second Task
   - Day 5 (Fri Feb 14): Deploy + Stress Test
   - Day 6 (Sat Feb 15): Golden Response Cache
   - Day 7 (Sun Feb 16): Demo Prep

2. **Check what's done** — Run `git log --oneline -20` to see recent commits and understand current progress.

3. **Check current state** — Run `git status` and look at the project structure to understand what exists.

4. **Report** — Give Drew a concise briefing:
   - What day of the roadmap we're on
   - What was completed yesterday (based on git log)
   - Today's checklist (pull from ROADMAP.md for the current day)
   - The end-of-day gate that must be hit
   - Any blockers or risks to flag

5. **SME reminder** — Based on today's planned work, suggest which SMEs might be useful:
   - Writing new story content? → `story-writer`, `character-director`, `ece-professor`
   - Modifying 3D scenes? → `3d-game-development`, `3d-scale-tester`
   - Updating system prompts or cache? → `prompt-writer`
   - Any kid-facing text changes? → `child-game-design`
   - Pre-demo day? → `/review-content all` for full audit

   Format: "**SMEs for today:** `/sme story-writer`, `/sme ece-professor` — relevant for {reason}."

6. **Ask** — "What do you want to tackle first?"

Keep it short. Drew is solo and needs to start coding, not reading reports.
