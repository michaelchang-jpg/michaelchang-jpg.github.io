/**
 * scripts/publish-tool.js
 * Automated blog publishing tool for Dorothy.
 * Usage: node scripts/publish-tool.js <json_file>
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BLOG_DIR = path.join(__dirname, '../blog');
const TEMPLATE_PATH = path.join(BLOG_DIR, 'posts/template.html');

async function publish() {
    const dataPath = process.argv[2];
    if (!dataPath) {
        console.error('Usage: node scripts/publish-tool.js <json_file>');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { title, date, content, image, tags, slug } = data;

    const isoDate = new Date(date).toISOString();
    const displayDate = date.replace(/-/g, '.');
    const filename = `${slug || date + '-post'}.html`;
    const postPath = path.join(BLOG_DIR, 'posts', filename);

    // 1. Generate HTML from template
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    let html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{ISO_DATE}}/g, isoDate)
        .replace(/{{DISPLAY_DATE}}/g, displayDate)
        .replace(/{{IMAGE}}/g, image)
        .replace(/{{CONTENT}}/g, content.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('\n'))
        .replace(/{{TAGS}}/g, tags.map(t => `<span class="tag">#${t}</span>`).join('\n'));

    fs.writeFileSync(postPath, html);
    console.log(`Created post: ${filename}`);

    // 2. Sync Navigation
    console.log('Syncing navigation...');
    execSync('node scripts/update-blog-nav-fix.js', { stdio: 'inherit' });

    // 3. Git Operations
    console.log('Pushing to GitHub...');
    try {
        execSync('cd blog && git add .', { stdio: 'inherit' });
        execSync(`cd blog && git commit -m "feat: publish ${title}"`, { stdio: 'inherit' });
        execSync('cd blog && git push origin master', { stdio: 'inherit' });
        console.log('Successfully published and pushed to GitHub!');
    } catch (err) {
        console.error('Git push failed. Please check manual connectivity.');
    }
}

publish();
