const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // 需要 cheerio 來解析 HTML

const BLOG_DIR = path.join(__dirname, '../blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

// 1. 讀取所有文章並提取標題與日期
function getAllPosts() {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.html') && file !== 'template.html');
    const posts = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const $ = cheerio.load(content);
        const title = $('h2.post-title').text().trim();
        const dateStr = $('.post-date').text().trim(); // e.g., 2026.02.07
        const dateTimeAttr = $('.post-date').attr('data-time');
        
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
            title: title,
            date: date,
            mtime: stats.mtime
        });
    });

    return posts.sort((a, b) => {
        const timeA = a.date.getTime();
        const timeB = b.date.getTime();
        if (timeA !== timeB) {
            return timeB - timeA;
        }
        return b.mtime - a.mtime;
    });
}

// 2. 生成 HTML 列表
function generateNavHtml(posts, isIndexPage) {
    return posts.map(post => {
        const link = isIndexPage ? `posts/${post.filename}` : post.filename;
        return `            <li><a href="${link}">${post.title}</a></li>`;
    }).join('\n');
}

// 3. 更新所有檔案
function updateAllFiles() {
    const posts = getAllPosts();
    console.log(`Found ${posts.length} posts.`);

    const newNavHtmlIndex = generateNavHtml(posts, true);
    const navBlockIndex = `
    <nav id="blog-nav">
        <button class="menu-toggle">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${newNavHtmlIndex}
        </ul>
    </nav>`;

    // 更新 index.html
    const indexFile = path.join(BLOG_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
        let content = fs.readFileSync(indexFile, 'utf8');
        // 刪除所有現有的 nav 區塊
        content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '');
        // 在 site-header-group 後面插入新的 nav
        content = content.replace('</div>\n            \n', '</div>\n            ' + navBlockIndex + '\n');
        
        // 確保 script 只有一個
        content = content.replace(/<script src="[^"]*load-nav\.js"><\/script>/g, '');
        content = content.replace('</body>', '    <script src="scripts/load-nav.js"></script>\n</body>');
        
        fs.writeFileSync(indexFile, content);
        console.log('Updated index.html');
    }

    const newNavHtmlPost = generateNavHtml(posts, false);
    const navBlockPost = `
    <nav id="blog-nav">
        <button class="menu-toggle">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${newNavHtmlPost}
        </ul>
    </nav>`;

    // 更新 posts/*.html
    posts.forEach(post => {
        const filePath = path.join(POSTS_DIR, post.filename);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 刪除所有現有的 nav 區塊
        content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '');
        // 在 site-header-group 後面插入新的 nav
        content = content.replace('</div>\n            \n', '</div>\n            ' + navBlockPost + '\n');

        // 確保 script 只有一個
        content = content.replace(/<script src="[^"]*load-nav\.js"><\/script>/g, '');
        content = content.replace('</body>', '    <script src="../scripts/load-nav.js"></script>\n</body>');
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${post.filename}`);
    });
}

try {
    updateAllFiles();
} catch (e) {
    console.error('Update failed:', e);
}
