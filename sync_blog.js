const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 注意：現在我們在根目錄運行，所以路徑要調整
const BLOG_DIR = __dirname;
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

function getAllPosts() {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.html') && file !== 'template.html');
    const posts = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const $ = cheerio.load(content);
        const title = $('h2.post-title').first().text().trim();
        const dateStr = $('.post-date').first().text().trim();
        const dateTimeAttr = $('.post-date').first().attr('data-time');
        
        const stats = fs.statSync(path.join(POSTS_DIR, file));

        let date = new Date(0);
        if (dateTimeAttr) {
            date = new Date(dateTimeAttr);
        } else if (dateStr) {
            const parts = dateStr.split('.');
            if (parts.length === 3) {
                date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
            }
        }

        posts.push({
            filename: file,
            title: title || file,
            date: date,
            mtime: stats.mtime
        });
    });

    return posts.sort((a, b) => {
        const timeA = a.date.getTime();
        const timeB = b.date.getTime();
        if (timeA !== timeB) return timeB - timeA;
        return b.mtime - a.mtime;
    });
}

function generateNavHtml(posts, isIndexPage) {
    return posts.map(post => {
        const link = isIndexPage ? `posts/${post.filename}` : post.filename;
        return `            <li><a href="${link}">${post.title}</a></li>`;
    }).join('\n');
}

function updateFile(filePath, navHtml, scriptPath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // 1. 移除所有現有的 nav
    $('nav').remove();
    // 2. 移除所有現有的 load-nav.js 引用
    $('script[src*="load-nav.js"]').remove();

    const navBlock = `
    <nav id="blog-nav">
        <button class="menu-toggle">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${navHtml}
        </ul>
    </nav>`;

    // 3. 在 .site-header-group 後面插入新 nav
    $('.site-header-group').after(navBlock);

    // 4. 在 body 結束前插入 script
    $('body').append(`    <script src="${scriptPath}"></script>\n`);

    fs.writeFileSync(filePath, $.html());
}

function run() {
    const posts = getAllPosts();
    console.log(`Syncing ${posts.length} posts...`);

    const navHtmlIndex = generateNavHtml(posts, true);
    const navHtmlPost = generateNavHtml(posts, false);

    // 更新根目錄 index.html
    const indexFile = path.join(BLOG_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
        updateFile(indexFile, navHtmlIndex, 'scripts/load-nav.js');
        console.log('Updated root index.html');
    }

    // 更新 posts/*.html
    posts.forEach(post => {
        updateFile(path.join(POSTS_DIR, post.filename), navHtmlPost, '../scripts/load-nav.js');
        console.log(`Updated posts/${post.filename}`);
    });
}

try {
    run();
} catch (e) {
    console.error(e);
}
