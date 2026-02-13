const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html') && f !== 'template.html');

const posts = files.map(filename => {
    let dateStr = '2026.02.13';
    const dateFileMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(filename);
    if (dateFileMatch) {
        dateStr = `${dateFileMatch[1]}.${dateFileMatch[2]}.${dateFileMatch[3]}`;
    }
    return { filename, dateStr };
});

posts.sort((a, b) => {
    const dA = new Date(a.dateStr.replace(/\./g, '-'));
    const dB = new Date(b.dateStr.replace(/\./g, '-'));
    return dB - dA;
});

console.log(JSON.stringify(posts.slice(0, 5), null, 2));
