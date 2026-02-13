const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');

console.log(`Scanning posts in ${POSTS_DIR}...`);

if (!fs.existsSync(POSTS_DIR)) {
    console.error("Posts directory not found!");
    process.exit(1);
}

// 1. Scan Posts
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html') && f !== 'template.html');
let postsData = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    
    // Extract Title (Simple Regex)
    let title = file.replace('.html', '');
    const titleMatch = content.match(/<h2[^>]*class=["']post-title["'][^>]*>([\s\S]*?)<\/h2>/i);
    if (titleMatch) {
        title = titleMatch[1].trim();
    }

    // Extract Date
    let dateVal = 0;
    const dateMatch = content.match(/<div[^>]*class=["']post-date["'][^>]*>([\s\S]*?)<\/div>/i);
    if (dateMatch) {
        const dateStr = dateMatch[1].trim().replace(/\./g, '-');
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) dateVal = d.getTime();
    }
    
    // Fallback Date from Filename
    if (!dateVal) {
        const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) dateVal = new Date(match[1]).getTime();
    }

    postsData.push({ file, title, date: dateVal || 0 });
});

// Sort
postsData.sort((a, b) => b.date - a.date);

console.log(`Found ${postsData.length} posts. Latest: ${postsData[0].title}`);

// 2. Generate HTML Lists
const listHtmlIndex = postsData.map(p => `                    <li><a href="posts/${p.file}">${p.title}</a></li>`).join('\n');
const listHtmlPosts = postsData.map(p => `                    <li><a href="${p.file}">${p.title}</a></li>`).join('\n');

// 3. Update Index
if (fs.existsSync(INDEX_FILE)) {
    let content = fs.readFileSync(INDEX_FILE, 'utf8');
    const regex = /(<ul[^>]*class=["']post-list["'][^>]*>)([\s\S]*?)(<\/ul>)/i;
    if (regex.test(content)) {
        content = content.replace(regex, `$1\n${listHtmlIndex}\n                $3`);
        fs.writeFileSync(INDEX_FILE, content);
        console.log("Updated index.html");
    } else {
        console.warn("Could not find <ul class='post-list'> in index.html");
    }
}

// 4. Update Posts
files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /(<ul[^>]*class=["']post-list["'][^>]*>)([\s\S]*?)(<\/ul>)/i;
    
    if (regex.test(content)) {
        let newList = listHtmlPosts;
        // Add active class
        const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const linkRegex = new RegExp(`href=["']${escapedFile}["']`);
        newList = newList.replace(linkRegex, `href="${file}" class="active"`);
        
        content = content.replace(regex, `$1\n${newList}\n                $3`);
        fs.writeFileSync(filePath, content);
        // console.log(`Updated ${file}`);
    }
});

console.log("All files updated locally.");
