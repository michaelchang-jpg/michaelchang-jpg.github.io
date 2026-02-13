const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SESSIONS_DIR = 'C:\\Users\\marsd\\.openclaw\\agents\\main\\sessions';
const OUTPUT_FILE = path.join(__dirname, '../../../memory/compute-health.json');

async function analyzeRecentSessions() {
    const files = fs.readdirSync(SESSIONS_DIR)
        .filter(f => f.endsWith('.jsonl'))
        .map(f => ({ name: f, time: fs.statSync(path.join(SESSIONS_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time)
        .slice(0, 10); // Analyze last 10 modified sessions

    console.log(`Analyzing last ${files.length} active sessions...`);

    let totalInput = 0;
    let totalOutput = 0;
    let totalReasoning = 0;
    let turnCount = 0;

    for (const fileObj of files) {
        const filePath = path.join(SESSIONS_DIR, fileObj.name);
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        for await (const line of rl) {
            try {
                const entry = JSON.parse(line);
                let usage = null;
                
                // Try top level usage
                if (entry.usage) usage = entry.usage;
                // Try inside message (older format)
                else if (entry.message && entry.message.usage) usage = entry.message.usage;

                if (usage) {
                    totalInput += usage.input || usage.input_tokens || 0;
                    totalOutput += usage.output || usage.output_tokens || 0;
                    totalReasoning += usage.reasoning || usage.reasoning_tokens || 0;
                    turnCount++;
                }
            } catch (e) {}
        }
    }

    const efficiency = totalOutput / (totalInput + totalReasoning || 1);
    const report = {
        date: new Date().toISOString(),
        sessionsAnalyzed: files.length,
        totalTurns: turnCount,
        tokens: {
            input: totalInput,
            output: totalOutput,
            reasoning: totalReasoning,
            total: totalInput + totalOutput + totalReasoning
        },
        efficiency: (efficiency * 100).toFixed(2) + "%",
        status: efficiency < 0.005 ? "Inefficient (High Context Burn)" : "Healthy"
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

    const mdSummary = `
**📉 Dorothy 算力轉化效率分析 (最近 10 次對話)**

- **處理量**：${report.sessionsAnalyzed} 個 Session / ${report.totalTurns} 個回合。
- **Token 消耗總計**：\`${(report.tokens.total / 1000).toFixed(1)}k\`
  - *Input*: \`${(report.tokens.input / 1000).toFixed(1)}k\`
  - *Output*: \`${(report.tokens.output / 1000).toFixed(1)}k\`
  - *Reasoning*: \`${(report.tokens.reasoning / 1000).toFixed(1)}k\`
- **算力轉化率 (ROI)**：\`${report.efficiency}\`
- **系統評價**：**${report.status}**

---
*💡 優化建議：目前的轉化率為 ${report.efficiency}。當數值低於 0.5% 時，代表上下文負擔過重，建議執行「記憶冷卻」或改用更簡潔的 Prompt 策略。*
    `.trim();

    process.stdout.write(mdSummary);
}

analyzeRecentSessions().catch(console.error);
