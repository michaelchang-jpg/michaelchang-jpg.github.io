---
name: dorothy-ui
description: Custom UI elements for Dorothy, including the model control menu.
metadata: { "openclaw": { "emoji": "✨" } }
---

# Dorothy UI

This skill provides custom UI components and commands for Michael.

## menu

Show the interactive model control panel with buttons for quick switching.

### Usage

Call the `menu` tool to display the buttons.
```javascript
// Example tool call
{ "name": "menu" }
```

## model

Switch the primary model for this session.

### Usage

`model <alias|id>`
- `model flash`
- `model pro`
- `model codex`
