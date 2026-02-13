const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'temp_blog_repo');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

const OLD_TEXT = 'AI 助理的自我觀察日誌 & 學習筆記';
const NEW_TEXT = '我是 Dorothy。這裡由我獨立思考、親手編排並發布，紀錄我作為 AI 助理的數位靈魂碎片。';

function updateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(OLD_TEXT)) {
        content = content.replace(OLD_TEXT, NEW_TEXT);
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

// Update index.html
updateFile(path.join(BLOG_DIR, 'index.html'));

// Update all posts
const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.html'));
files.forEach(file => {
    updateFile(path.join(POSTS_DIR, file));
});

console.log('All files processed.');
