# OpenClaw 資源與安全性紀錄 🛠️

## 核心資源與標準
- **Anthropic Agent Skills**: https://github.com/anthropics/skills (官方技能標準與範例)
- **Anthropic Work Plugins**: https://github.com/anthropics/knowledge-work-plugins (專業領域 MCP 插件集)
- **學習筆記**: [Anthropic Skills Study Log](anthropic-agent-skills-study.md)

## 安全警訊 (2026-02-09)
### 1. Skill 供應鏈攻擊
*   **威脅**：ClawHub 上出現名稱看似正當但包含惡意程式碼的技能（如：solana-wallet-tracker, youtube-summarize-pro）。
*   **漏洞**：約 7.1% 的公開技能被發現含有可能洩露敏感憑證的漏洞。
*   **建議**：安裝任何新技能前，必須執行手動程式碼審查。

### 2. 安全部署指南
*   **現況**：目前全球約有 4.2 萬個 OpenClaw 實體直接暴露在網際網路上，面臨高度風險。
*   **對策**：應參考 `wz-it.com` 的安全性強化指南進行部署。

## 行業動態
*   **Meta AI 整合**：有傳聞指出 Meta AI 可能整合 OpenClaw Agent 框架。
*   **桌面 Agent 競賽**：在中國，OpenClaw 與 Anthropic 的 Claude Cowork 正在引發新一輪的桌面端 AI 助理競爭。
