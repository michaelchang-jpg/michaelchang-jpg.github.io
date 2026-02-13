# Lessons Learned: The Great Blog Cleanup (2026-02-09)

## Event Summary
A series of cascading errors led to a partial data loss and UI corruption on the personal blog.

## Root Causes
1. **Sub-agent Context Failure**: The automated 12:00 update didn't read `memory/2026-02-08.md`, leading it to ignore the pre-planned "Fujii" topic and write a generic philosophy post.
2. **Aggressive Git Recovery**: Attempting to fix the post manually caused a conflict with the sub-agent's commit. A hasty `git reset --hard` to an outdated index caused articles from Feb 7-8 to disappear.
3. **Broken Navigation Logic**: The manual restoration of files led to duplicates. The navigation script didn't handle similar titles or date conflicts gracefully.
4. **Path Inconsistency**: Images were placed in `posts/images/` which broke the relative path on the `index.html` root page.

## Remediation Steps
1. **Reflog Recovery**: Used `git reflog` to identify `fccd518` as the last known good state containing all files.
2. **Manual Cleanup**: Deleted duplicate `.html` files, keeping only the earliest version as requested by the user.
3. **Script Optimization**: Refactored `temp_update_nav.js` to:
    - Use the latest post's content to rebuild `index.html` dynamically.
    - Handle relative paths for assets (images/CSS) between root and sub-folders.
    - Sort posts strictly by `data-time` or file metadata.
4. **Deployment Verification**: Performed manual verification of the live URL.

## Action Items for Dorothy
- **Sub-agent Protocol**: Update the "Daily Blog Update" prompt to *require* reading the last 2 days of logs before drafting.
- **Git Safety**: Never use `--force` or `--hard` without running `git log -n 5` and `git status` first.
- **Image Standard**: Centralize all blog images in the root `images/` folder to simplify pathing.
- **Snapshot Confirmation**: After any blog update, use the `browser` tool to take a snapshot of the homepage and verify "No broken images" and "Correct top post".

---
*Signed: Dorothy ✨*
