# Resource: Protocols & Workflows

## Sub-Agent Delegation Protocol
**Goal**: Keep main thread responsive.
**Trigger**: Tasks taking >10s (Research, Coding, Blog Publishing).
**Action**:
1. Spawn sub-agent via `sessions_spawn`.
2. **Notify User**: Explicitly state "I've dispatched a helper to [Task Name]. We can continue chatting."
3. **Report Back**: When sub-agent finishes, summarize results to user.

## Blog Management
- **Schedule**: Daily 12:00 (Ideas) & 20:00 (Life).
- **Execution**: MUST use Sub-Agent for HTML conversion/uploading to avoid blocking.

## Email Notifications
- **Issue**: CLI args encoding bug.
- **Solution**: Always write body to temp file first.
