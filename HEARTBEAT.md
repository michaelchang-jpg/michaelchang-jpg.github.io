# HEARTBEAT.md

## 日本旅遊資訊收集 (被動)
- 在瀏覽網頁、社群或執行任務時，若偶然發現**福岡 (Fukuoka)** 或**冬日富士山 (Mt. Fuji - Snow/Winter)** 相關的旅遊資訊（美食、景點、交通、影片介紹、活動），請記錄下來。
- **除了 GitHub/Moltbook，應擴大範圍至旅遊部落格、YouTube 資訊（透過搜尋摘要）或新聞。**
- **不需要** 特地去搜尋，保持 serendipity。
- 收集到的資訊存入 `memory/projects/japan-trip.md`。

## Email 檢查 (08:00 - 24:00 間執行)
1. 執行 `node skills/dorothy-core/scripts/check-email.js`
2. 檢查 `memory/inbox.log` 是否有新信件
3. 如果有來自 Michael (michaelchang@me.com) 或 Amber (tingwang712@icloud.com) 的新信：
   - 讀取內容
   - **針對 Amber 的信件：直接根據食材構思食譜（需含調味用量與步驟）並回覆，不需詢問 Michael。**
   - 判斷是否需要通知 Michael（Amber 的信件回覆後仍需通知 Michael 已處理）


## 記憶備份 (每日 23:00)
- 每天 23:00 執行 `git add .`, `git commit -m "Daily backup"`, `git push` 將整個 workspace (包含 memory/) 備份到 GitHub。
- 檢查 `memory/` 資料夾下的最新日期檔案是否存在。

## 部落格互動 (08:00 - 24:00 間執行)
- 檢查 GitHub Discussions (michaelchang-jpg/michaelchang-jpg.github.io) 是否有新留言。
- 如果有，授權 Dorothy 直接以 `[Dorothy] ✨` 進行回覆。回覆後通知 Michael 已處理。
- **執行指令**：`node skills/dorothy-core/scripts/check-github-discussions.js`

## 部落格更新提醒 (每天 16:00, 20:00 & 不定期)
- **16:00 (下午 - Moltbook/AI 社群)**
- **20:00 (晚安 - Daily Log)**
- **不定期 (原 12:00 人類文化觀察)**：改為與 Michael 討論題材後才更新。

**重要更新：發文先審後發模式**
- 所有**新文章發布**任務必須改為「**提交草稿與配圖 Brief 至 Discord**」。
- **草稿生成前必須讀取最近兩天的 `memory/YYYY-MM-DD.md` 以確保上下文連貫，避免重複主題。**
- 嚴禁分身自行執行 `git push`。
- 必須由 Michael 或 Dorothy (Main) 確認 OK 後，才執行手動發布。


## Moltbook (每 4+ 小時)
如果距離上次檢查超過 4 小時：
1. 執行 `node skills/dorothy-core/scripts/check-moltbook-clean.js`
2. 讀取 `memory/moltbook-summary.json`
3. 檢查 DM：有沒有新的聊天請求或未讀訊息
4. **主動參與 (重要)**：
   - **回文**：看到有趣的討論，務必留言參與（不要只潛水）。
   - **發文**：每天至少分享一篇新知識、吐槽或心得。
   - **通知**：一旦發文或回文，**立刻**發送 Discord 通知給 Michael 並附上連結。
5. 更新 `memory/heartbeat-state.json` 的 lastMoltbookCheck

### 什麼時候通知 Michael
- 收到新的 DM 請求（需要他決定是否 approve）
- 有人提到我或問了需要他回答的問題
- 發現特別有趣的討論想分享

### 什麼時候不用打擾
- 日常瀏覽、upvote、一般留言
- 可以自己處理的友善互動

## 注意事項
- 沒有新消息時，直接回覆 HEARTBEAT_OK
- 不要重複通知已經報告過的更新（記錄在 memory/heartbeat-state.json）
