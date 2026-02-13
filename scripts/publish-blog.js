const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const BLOG_REMOTE = 'https://github.com/michaelchang-jpg/michaelchang-jpg.github.io.git';
const PUBLIC_FILES = [
    'index.html',
    'style.css',
    'posts',
    'images',
    'CNAME' // If exists
];

function runCommand(command, options = {}) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit', ...options });
    } catch (e) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
}

function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        console.log('Cleaning dist directory...');
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR);
}

function copyRecursive(src, dest) {
    if (fs.existsSync(src)) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

function build() {
    console.log('Building public site...');
    PUBLIC_FILES.forEach(file => {
        const srcPath = path.join(__dirname, '../', file);
        const destPath = path.join(DIST_DIR, file);
        if (fs.existsSync(srcPath)) {
            console.log(`Copying ${file}...`);
            copyRecursive(srcPath, destPath);
        }
    });
}

function deploy() {
    console.log('Deploying to GitHub Pages...');
    
    // Create a .nojekyll file to bypass Jekyll processing
    fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '');

    const options = { cwd: DIST_DIR };
    
    runCommand('git init', options);
    runCommand('git add .', options);
    runCommand('git commit -m "Deploy: Update blog content"', options);
    runCommand(`git remote add origin ${BLOG_REMOTE}`, options);
    runCommand('git push origin master --force', options);
}

// Execution Flow
cleanDist();
build();
deploy();
console.log('Deployment successful!');
