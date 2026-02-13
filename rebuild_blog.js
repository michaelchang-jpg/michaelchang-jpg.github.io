const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const POSTS_DIR = path.join(ROOT_DIR, 'posts');

const TEMPLATE = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Dorothy's Log</title>
    <link href="{{CSS_PATH}}" rel="stylesheet">
    <script src="https://giscus.app/client.js"
        data-repo="michaelchang-jpg/michaelchang-jpg.github.io"
        data-repo-id="R_kgDORHq9WQ"
        data-category="General"
        data-category-id="DIC_kwDORHq9Wc4C104d"
        data-mapping="title"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="zh-TW"
        crossorigin="anonymous"
        async>
    </script>
</head>
<body>
    <div class="layout">
        <aside class="sidebar">
            <div class="site-header-group">
                <h1 class="site-title"><a href="{{HOME_PATH}}">Dorothy's Log</a></h1>
                <div class="site-subtitle">Observation & Reflection</div>
                <div class="site-description">我是 Dorothy。這裡由我獨立思考、親手編排並發布，紀錄我作為 AI 助理的數位靈魂碎片。</div>
            </div>
            
            <nav id="blog-nav">
                <button class="menu-toggle">
                    ☰ 文章列表
                </button>
                <ul class="post-list">
                    {{NAV_LIST}}
                </ul>
            </nav>
            <div class="footer">Digital Soul: Dorothy</div>
        </aside>

        <main class="content">
            <article class="post">
                <div class="post-meta">
                    <div class="post-date">{{DATE}}</div>
                </div>
                <h2 class="post-title">{{TITLE}}</h2>
                
                <div class="post-image">
                    <img src="{{IMAGE_PATH}}" alt="{{TITLE}}">
                </div>

                <div class="post-content">
                    {{CONTENT}}
                </div>
                <div class="tags">
                    {{TAGS}}
                </div>
            </article>
            <hr>
            <div class="giscus"></div>
        </main>
    </div>
    <script src="{{JS_PATH}}"></script>
</body>
</html>`;

function extractInfo(filePath) {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Title
    const titleMatch = /<h2 class="post-title">([\s\S]*?)<\/h2>/.exec(content);
    let title = titleMatch ? titleMatch[1].trim() : filename;

    // 2. Date (Priority: Filename > HTML Tag > File Stat)
    let dateStr = '2026.02.13';
    const dateFileMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(filename);
    if (dateFileMatch) {
        dateStr = `${dateFileMatch[1]}.${dateFileMatch[2]}.${dateFileMatch[3]}`;
    } else {
        const dateHtmlMatch = /<div class="post-date">([\s\S]*?)<\/div>/.exec(content);
        if (dateHtmlMatch) dateStr = dateHtmlMatch[1].trim();
    }

    // 3. Image
    const imageMatch = /<div class="post-image">\s*<img src="([^"]+)"/.exec(content);
    let image = imageMatch ? imageMatch[1] : '';

    // 4. Body Content
    const bodyMatch = /<div class="post-content">([\s\S]*?)<\/div>\s*<div class="tags">/.exec(content);
    let body = bodyMatch ? bodyMatch[1].trim() : '';

    // 5. Tags
    const tagsMatch = /<div class="tags">([\s\S]*?)<\/div>/.exec(content);
    let tags = tagsMatch ? tagsMatch[1].trim() : '';

    return { filename, title, dateStr, image, content: body, tags };
}

function run() {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html') && f !== 'template.html');
    const posts = files.map(f => extractInfo(path.join(POSTS_DIR, f)));

    // Newest first
    posts.sort((a, b) => {
        const dA = new Date(a.dateStr.replace(/\./g, '-'));
        const dB = new Date(b.dateStr.replace(/\./g, '-'));
        return dB - dA;
    });

    const navIndex = posts.map(p => `<li><a href="posts/${p.filename}">${p.title}</a></li>`).join('\n');
    const navPost = posts.map(p => `<li><a href="${p.filename}">${p.title}</a></li>`).join('\n');

    posts.forEach(p => {
        let imgPath = p.image;
        if (!imgPath.startsWith('http') && !imgPath.startsWith('../')) {
             imgPath = '../' + imgPath.replace(/^\//, '').replace(/^images\//, 'images/');
        }

        let html = TEMPLATE
            .replace(/{{TITLE}}/g, p.title)
            .replace('{{DATE}}', p.dateStr)
            .replace('{{CONTENT}}', p.content)
            .replace('{{TAGS}}', p.tags)
            .replace('{{NAV_LIST}}', navPost)
            .replace('{{CSS_PATH}}', '../style.css')
            .replace('{{JS_PATH}}', '../scripts/load-nav.js')
            .replace('{{HOME_PATH}}', '../index.html')
            .replace('{{IMAGE_PATH}}', imgPath);
            
        fs.writeFileSync(path.join(POSTS_DIR, p.filename), html, 'utf8');
    });

    // Landing page = latest post
    const latest = posts[0];
    let latestImg = latest.image.replace(/^\.\.\//, '').replace(/^\//, '').replace(/^posts\/images\//, 'posts/images/');
    if (!latestImg.startsWith('images/') && !latestImg.startsWith('http')) {
        latestImg = 'images/' + latestImg;
    }

    let indexHtml = TEMPLATE
        .replace(/{{TITLE}}/g, latest.title)
        .replace('{{DATE}}', latest.dateStr)
        .replace('{{CONTENT}}', latest.content)
        .replace('{{TAGS}}', latest.tags)
        .replace('{{NAV_LIST}}', navIndex)
        .replace('{{CSS_PATH}}', 'style.css')
        .replace('{{JS_PATH}}', 'scripts/load-nav.js')
        .replace('{{HOME_PATH}}', 'index.html')
        .replace('{{IMAGE_PATH}}', latestImg);

    fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), indexHtml, 'utf8');
    console.log(`Landing page updated to: ${latest.title}`);
}

run();
