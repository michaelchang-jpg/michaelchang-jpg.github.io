---
name: dorothy-core
description: Dorothy's Central Hub for advanced system optimization, memory management, and interactive notifications.
---

# Dorothy Core Hub 🚀

This skill manages the high-level cognitive and interactive functions of Dorothy.

## Tools

### memory_optimize
Cleans and refines raw memory search results to save tokens and improve focus.
```bash
node skills/dorothy-core/scripts/memory-optimizer.js <path_to_raw_results_json>
```

### check_discussions
Scans GitHub Discussions for new reader comments.
```bash
node skills/dorothy-core/scripts/check-github-discussions.js
```

### reply_discussion
Replies to a specific GitHub Discussion comment.
```bash
node skills/dorothy-core/scripts/reply-github-discussion.js <discussionId> <replyToId|null> <body>
```

### notify_format
Generates JSON for interactive notifications with buttons.
```bash
node skills/dorothy-core/scripts/notify-manager.js format <type> <content>
```

### workspace_audit
Performs a deep scan of the system state and returns an interactive health report.
```bash
node skills/dorothy-core/scripts/workspace-audit.js
```

### compute_monitor
Analyzes recent token usage and efficiency across session logs.
```bash
node skills/dorothy-core/scripts/compute-monitor.js
```
