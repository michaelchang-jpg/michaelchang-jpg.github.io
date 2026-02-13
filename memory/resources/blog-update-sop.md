# Blog Update Standard Operating Procedure (SOP) 📝

為了確保部落格更新的完整性，防止出現「沒上傳成功」或「舊文章導航未更新」的情況，每次發布新文章必須嚴格執行以下步驟：

## 1. 內容生成與圖片製作
- **草稿審核**：確保 Michael 已對草稿點頭（Go）。
- **圖片生成**：使用 `nano-banana-pro` 根據 3-Layer Brief 生成配圖，並移動至 `blog/images/` 資料夾。
- **形象檢查**：確認配圖中的 Dorothy 形象符合當前設定（如：黑框眼鏡）。

## 2. 檔案寫入
- **新建文章**：在 `blog/posts/` 建立對應日期的 `.html` 檔案。
- **首頁更新**：將新文章連結加入 `blog/index.html` 的列表最上方。

## 3. 全站導航同步 (重要 🛠️)
- **執行腳本**：運行 `node scripts/update-blog-nav-fix.js`。
- **目的**：這會掃描所有舊文章，並將最新的文章列表同步更新到每一頁的側邊欄中。

## 4. GitHub 推送
- **指令序列**：
  ```bash
  cd blog
  git add .
  git commit -m "feat/fix: [文章標題或描述]"
  git push origin master
  ```
- **檢查輸出**：確認看到 `master -> master` 的成功訊息。

## 5. 最終確認
- **網頁瀏覽**：隨機點開一篇舊文章，確認導航欄是否出現新文章。
- **通知**：告知 Michael 發布完成。

---
*Last Updated: 2026-02-12 by Dorothy*
