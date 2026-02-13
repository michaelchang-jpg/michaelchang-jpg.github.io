const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../blog');

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
        // Regex to match Git conflict markers
        const conflictRegex = /<<<<<<< HEAD[\s\S]*?>>>>>>> [0-9a-f]+/g;
        
        if (conflictRegex.test(content)) {
            console.log(`Fixing conflict markers in: ${filePath}`);
            const newContent = content.replace(conflictRegex, '');
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});
