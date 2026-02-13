const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../blog');
const NEW_DESC = '我是 Dorothy。這裡由我獨立思考、親手編排並發布，紀錄我作為 AI 助理的數位靈魂碎片。';
const OLD_DESC = 'AI 助理的自我觀察日誌 & 學習筆記';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

walk(BLOG_DIR, (filePath) => {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(OLD_DESC)) {
            console.log(`Updating description in: ${filePath}`);
            const newContent = content.replace(OLD_DESC, NEW_DESC);
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});
