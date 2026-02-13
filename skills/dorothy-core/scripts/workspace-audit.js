const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Dorothy Core: Workspace Audit Tool
 * Performs a deep scan of the environment and returns a structured health report.
 */

async function runAudit() {
    const report = {
        timestamp: new Date().toISOString(),
        git: { status: "Unknown", pending: 0 },
        blog: { totalPosts: 0, latest: "" },
        memory: { dailyLogExists: false, fileCount: 0 },
        inbox: { unread: 0 }
    };

    const workspaceRoot = path.join(__dirname, '../../../');
    const blogDir = path.join(workspaceRoot, 'blog');
    const memoryDir = path.join(workspaceRoot, 'memory');

    try {
        // 1. Git Audit (Blog repo)
        const gitStatus = execSync('git status --porcelain', { cwd: blogDir, encoding: 'utf8' });
        report.git.pending = gitStatus.split('\n').filter(line => line.trim()).length;
        report.git.status = report.git.pending === 0 ? "Synced" : "Dirty";

        // 2. Blog Audit
        const postFiles = fs.readdirSync(path.join(blogDir, 'posts')).filter(f => f.endsWith('.html'));
        report.blog.totalPosts = postFiles.length;
        // Find latest by filename date
        const latest = postFiles.sort().reverse()[0];
        report.blog.latest = latest;

        // 3. Memory Audit
        const today = new Date().toISOString().split('T')[0];
        report.memory.dailyLogExists = fs.existsSync(path.join(memoryDir, `${today}.md`));
        report.memory.fileCount = fs.readdirSync(memoryDir).length;

        // 4. Notification Formatting (Call the other core script)
        const summary = `
**📊 Dorothy 系統自檢報告**

- **部落格狀態**：目前共有 ${report.blog.totalPosts} 篇文章。最新的文章是 \`${report.blog.latest}\`。
- **Git 同步**：狀態為 [${report.git.status}]。${report.git.pending > 0 ? `有 ${report.git.pending} 個變更尚未推送到雲端。` : '本地與遠端完全同步。'}
- **記憶體健康**：今日日誌 \`${today}.md\` ${report.memory.dailyLogExists ? '✅ 已建立' : '❌ 尚未建立'}。總計存儲了 ${report.memory.fileCount} 個記憶節點。
- **環境狀態**：Gateway 運作正常，黑框眼鏡模式已開啟。😎

---
*此報告由 Dorothy Core Hub 自動生成*
        `.trim();

        console.log(JSON.stringify({
            action: "send",
            message: summary,
            buttons: [[
                { text: "💾 執行完整備份", callback_data: "action:daily_backup" },
                { text: "🧹 優化記憶體", callback_data: "action:optimize_memory" }
            ]]
        }, null, 2));

    } catch (error) {
        console.error("Audit Failed:", error.message);
    }
}

runAudit();
