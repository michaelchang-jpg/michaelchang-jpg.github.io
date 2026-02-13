const fs = require('fs');
const path = require('path');

const token = "8554400456:AAHG5Fz-sRrGujUEbISu609GsJNvzee3c5E";
const inboxFile = path.join(__dirname, 'telegram-inbox.jsonl');
let offset = 0;

async function poll() {
  // console.log("Polling...");
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=10`);
    const data = await res.json();
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        if (update.message) {
          const msg = {
            id: update.message.message_id,
            from: update.message.from.first_name,
            text: update.message.text || "[Media]",
            date: new Date().toISOString()
          };
          console.log(`NEW_MSG: ${JSON.stringify(msg)}`);
          fs.appendFileSync(inboxFile, JSON.stringify(msg) + "\n");
        }
      }
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
  setTimeout(poll, 2000);
}

console.log("Custom Telegram Poller Started.");
poll();
