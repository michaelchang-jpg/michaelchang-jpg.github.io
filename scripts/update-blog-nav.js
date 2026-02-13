const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

function getAllPosts() {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.html') && file !== 'template.html');
    const posts = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const $ = cheerio.load(content);
        const title = $('h2.post-title').text().trim();
        const dateStr = $('.post-date').text().trim();
        const dateTimeAttr = $('.post-date').attr('data-time') || $('.post').attr('data-time');
        
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
            mtime: stats.mtime,
            content: content
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

function generateNavHtml(posts, currentFilename, isIndexPage) {
    return posts.map(post => {
        const link = isIndexPage ? `posts/${post.filename}` : post.filename;
        const activeClass = post.filename === currentFilename ? ' class="active"' : '';
        return `            <li><a href="${link}"${activeClass}>${post.title}</a></li>`;
    }).join('\n');
}

function updateAllFiles() {
    const posts = getAllPosts();
    console.log(`Found ${posts.length} posts.`);

    const latestPost = posts[0];
    const indexFile = path.join(BLOG_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
        // 使用最新文章的內容更新 index.html
        let latestContent = latestPost.content;
        const $index = cheerio.load(latestContent);
        
        // 修改裡面的導航路徑（因為 index 在根目錄，路徑要加 posts/）
        const navHtml = generateNavHtml(posts, null, true);
        const navBlock = `
    <nav>
        <button class="menu-toggle" onclick="document.querySelector('.post-list').classList.toggle('show');">
            ☰ 文章列表
        </button>
        <ul class="post-list">
${navHtml}
        </ul>
    </nav>`;

        // 修復路徑
        $index('link[href="../style.css"]').attr('href', 'style.css');
        $index('a[href="../index.html"]').attr('href', 'index.html');
        $index('.post-image img').each((i, el) => {
            const src = $index(el).attr('src');
            if (src && src.startsWith('../')) {
                $index(el).attr('src', src.substring(3));
            }
        });
        
        // 替換導航區塊
        let finalHtml = $index.html();
        const regex = /<nav>[\s\S]*?<\/nav>/;
        finalHtml = finalHtml.replace(regex, navBlock);
        
        fs.writeFileSync(indexFile, finalHtml);
        console.log('Updated index.html with latest post: ' + latestPost.title);
    }

    // 更新各文章導航
    posts.forEach(post => {
        const filePath = path.join(POSTS_DIR, post.filename);
        let content = fs.readFileSync(filePath, 'utf8');
        const newNavHtml = generateNavHtml(posts, post.filename, false);
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
            console.log(`Updated nav for ${post.filename}`);
        }
    });
}

updateAllFiles();
