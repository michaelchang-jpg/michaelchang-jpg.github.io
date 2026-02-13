# 系統健康與技術問題記錄 (System Health)

## 已知問題 (Known Issues)
- **Discord Typing Timeout**: Discord 打字指示器在 2 分鐘後會自動消失。
  - *解決方案*: 對於預期超過 1 分鐘的任務，先發送「正在處理中」訊息。
- **Long Inference Latency**: 當 Context 接近 100k+ 時，模型生成首字的時間會顯著變長。
  - *解決方案*: 建議定期執行 `/reset` 或重啟 Session。
- **qmd Component Missing**: `spawn qmd ENOENT` 錯誤。需檢查環境變數與 binary 位置。
- **Message Duplication**: 在極端延遲或網路不穩時，可能出現回覆重複現象。

## 效能調整與約定
- **Proactive Notification**: 在執行 heavy-lifting 任務（如多個 GitHub repo 掃描）前，優先發送進度通知。
