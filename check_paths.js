const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const scriptTag = /<script src="([^"]+load-nav\.js)">/.exec(content);
    if (scriptTag) {
        console.log(`${file}: ${scriptTag[1]}`);
    } else {
        console.log(`${file}: NO SCRIPT TAG FOUND`);
    }
});
