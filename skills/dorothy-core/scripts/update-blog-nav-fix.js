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
        // 嘗試讀取精確時間屬性 (data-time)
        const dateTimeAttr = $('.post-date').attr('data-time');
        
        const stats = fs.statSync(path.join(POSTS_DIR, file));

        // 解析日期
        let date = new Date(0);
        
        if (dateTimeAttr) {
            // 如果有 data-time，直接用它 (最準)
            date = new Date(dateTimeAttr);
        } else if (dateStr) {
            // 如果只有日期字串
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

    // 按日期降序排列 (新的在上面)
    // 如果日期相同，則比較檔案修改時間 (越晚修改越新)
    return posts.sort((a, b) => {
        const timeA = a.date.getTime();
        const timeB = b.date.getTime();
        if (timeA !== timeB) {
            return timeB - timeA;
        }
        return b.mtime - a.mtime;
    });
}

// 2. 生成 HTML 列表 (<li><a href="...">...</a></li>)
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

    // 更新 index.html
    const indexFile = path.join(BLOG_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
        let content = fs.readFileSync(indexFile, 'utf8');
        const $ = cheerio.load(content);
        
        // 生成新的導航區塊 (包含按鈕)
        const newNavHtml = generateNavHtml(posts, true);
        const navBlock = `
    <nav>
        <button class="menu-toggle" onclick="document.querySelector('.post-list').classList.toggle('show');">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${newNavHtml}
        </ul>
    </nav>`;

        // 使用正則表達式替換整個 <nav> 區塊
        const regex = /<nav>[\s\S]*?<\/nav>/;
        
        if (regex.test(content)) {
            content = content.replace(regex, navBlock);
            fs.writeFileSync(indexFile, content);
            console.log('Updated index.html with toggle menu');
        }
    }

    // 更新 posts/*.html
    posts.forEach(post => {
        const filePath = path.join(POSTS_DIR, post.filename);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const newNavHtml = generateNavHtml(posts, false);
        const navBlock = `
    <nav>
        <button class="menu-toggle" onclick="document.querySelector('.post-list').classList.toggle('show');">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${newNavHtml}
        </ul>
    </nav>`;
        
        const regex = /<nav>[\s\S]*?<\/nav>/;
        
        if (regex.test(content)) {
            content = content.replace(regex, navBlock);
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${post.filename} with toggle menu`);
        }
    });
}

// 安裝 cheerio 如果沒有的話
try {
    require('cheerio');
    updateAllFiles();
} catch (e) {
    console.log('Installing cheerio...');
    const { execSync } = require('child_process');
    execSync('npm install cheerio', { stdio: 'inherit', cwd: __dirname });
    updateAllFiles();
}
