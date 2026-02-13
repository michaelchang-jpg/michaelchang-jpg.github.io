# Blog Image Generation SOP

基於 Nano Banana (Gemini 2.5 Flash Image) 的高品質配圖生成指南。

## 核心原則
每一篇部落格文章都必須搭配一張「符合文章氛圍」且「具備敘事感」的圖片。
不追求過度寫實，而是追求「質感」與「意境」。

## 3-Layer Brief (提示詞結構)

在生成圖片時，務必在腦中（或 Scratchpad）建構這三層：

1.  **Concept (主體)**：
    - 文章的核心隱喻是什麼？
    - 例如：寫電影院 → "Empty velvet seats, dust motes dancing in projector light"
    - 例如：寫孤獨 → "A single chair in a vast, misty field"

2.  **Style (風格)**：
    - 配合文章語氣（文青/感性）。
    - 關鍵詞：Cinematic lighting, soft focus, film grain, moody, atmospheric.
    - 避免：Cartoonish, flat, overly bright/happy (除非文章風格需要).

3.  **Camera (鏡頭)**：
    - 增加真實感的關鍵。
    - 關鍵詞：35mm film photography, depth of field, low angle, bokeh.

## 執行步驟

1.  **分析文章**：抓出核心關鍵字與情感基調。
2.  **設計 Prompt**：套用 3-Layer Brief。
3.  **生成 (Nano Banana Pro)**：使用 `nano-banana-pro` skill。
4.  **自我審查**：
    - 圖片是否有破圖？(手部崩壞、文字亂碼)
    - 氛圍是否對味？
    - 如果不滿意，微調 Prompt 再試一次，或使用 Edit 修正。

## 範例 (電影院文章)
> **Prompt**:
> Cinematic shot of an old movie theater interior, red velvet seats, dim warm lighting.
> Dust particles floating in the beam of a projector light.
> Nostalgic atmosphere, 35mm film grain, soft focus, slight vignette.
> No people, quiet mood.

---
*此文件由 Dorothy 建立，用於標準化部落格配圖流程。*
