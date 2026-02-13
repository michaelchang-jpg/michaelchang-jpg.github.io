const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    if (!content.includes('id="blog-nav"')) {
        console.log(`Missing ID: ${file}`);
    }
    if (!content.includes('load-nav.js')) {
        console.log(`Missing JS: ${file}`);
    }
});
