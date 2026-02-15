# Context Session Transfer

Manually trigger a full context session transfer. Use this when you want to proactively start a fresh session before context gets low, or any time you want a clean handoff.

## Instructions

Execute the following steps in order:

1. **Create the transfer directory**:
   - Today's date: use format YYYY-MM-DD
   - Timestamp: use format HHMMSS
   - Create directory: `.claude/context-session-transfer/temp/{today}/`

2. **Run the Context Session Auditor**: Review the entire current session. Identify everything contextually relevant:
   - Active tasks and their completion state
   - Key decisions made and WHY
   - Current git state (branch, uncommitted changes, modified files)
   - Important constraints, gotchas, user preferences
   - Exact next steps

   Write a structured handoff file to `.claude/context-session-transfer/temp/{today}/handoff-{timestamp}.md`

3. **Run the Session Transfer Agent**: Read the handoff file and the project directory from `~/.claude/.context-bridge/current-project`. Create a launch script at `.claude/context-session-transfer/temp/{today}/launch-session.sh` that:
   - `cd`s into the project directory
   - Runs `claude "$(cat handoff.md)"`
   - Make it executable with `chmod +x`

4. **Run the Session Transfer Auditor**: Verify the handoff file:
   - Cross-reference against actual `git status` and `git diff`
   - Verify all sections are present and actionable
   - Fill in any gaps directly
   - Score as PASS or NEEDS REVISION

5. **Report to the user**:
   - Show the path to the launch script
   - Ask if they want you to launch it automatically or run it themselves
   - Command: `bash {path/to/launch-session.sh}`
