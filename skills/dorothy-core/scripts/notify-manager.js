const { execSync } = require('child_process');

/**
 * Dorothy's Notification Manager
 * Formats and sends interactive Discord messages with buttons.
 */

const action = process.argv[2]; // 'send'
const type = process.argv[3];   // 'amber_recipe' | 'morning_report' | 'evening_report'
const content = process.argv[4]; // message body or path to body

if (!action || !type || !content) {
    console.error("Usage: node notify-manager.js <action> <type> <content>");
    process.exit(1);
}

function sendNotification() {
    let buttons = [];
    let title = "";
    let messageBody = content;

    switch (type) {
        case 'amber_recipe':
            title = "🍳 Amber 的新食材食譜草稿";
            buttons = [
                { text: "🚀 立即發送 Email", callback_data: "action:send_amber_email" },
                { text: "📝 我再修改一下", callback_data: "action:edit_amber_recipe" }
            ];
            break;
        case 'morning_report':
            title = "☀️ 早安日報已生成";
            buttons = [
                { text: "📧 查看 Email 內容", callback_data: "action:view_morning_report" },
                { text: "🐙 前往 GitHub", callback_data: "https://github.com/openclaw/openclaw" }
            ];
            break;
        case 'evening_report':
            title = "🌙 晚安日報彙整中";
            buttons = [
                { text: "📊 檢視今日進度", callback_data: "action:view_stats" },
                { text: "💾 執行手動備份", callback_data: "action:manual_backup" }
            ];
            break;
        default:
            title = "🔔 系統通知";
    }

    const fullMessage = `**${title}**\n\n${messageBody}`;
    
    // In a real OpenClaw tool environment, I would use the message tool.
    // Since this is a script, I'll output the JSON format that Dorothy can use to call the 'message' tool.
    console.log(JSON.stringify({
        action: "send",
        message: fullMessage,
        buttons: [buttons]
    }, null, 2));
}

if (action === 'format') {
    sendNotification();
}
