const fs = require('fs');
const path = require('path');

/**
 * memory-compressor.js
 * Identifies old daily logs for archiving and distillation.
 */

const MEMORY_DIR = path.join(__dirname, '../../../memory');
const ARCHIVE_DIR = path.join(MEMORY_DIR, 'Archives');
const DAYS_THRESHOLD = 3;

if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function getFilesToArchive() {
    const files = fs.readdirSync(MEMORY_DIR);
    const today = new Date();
    const toArchive = [];

    files.forEach(file => {
        if (/^\d{4}-\d{2}-\d{2}\.md$/.test(file)) {
            const filePath = path.join(MEMORY_DIR, file);
            const stats = fs.statSync(filePath);
            const fileDate = new Date(file.replace('.md', ''));
            
            const diffDays = (today - fileDate) / (1000 * 60 * 60 * 24);
            
            if (diffDays >= DAYS_THRESHOLD) {
                toArchive.push({
                    name: file,
                    path: filePath,
                    date: fileDate
                });
            }
        }
    });

    return toArchive;
}

const files = getFilesToArchive();

if (files.length === 0) {
    console.log("No files to archive.");
} else {
    files.forEach(file => {
        const destPath = path.join(ARCHIVE_DIR, file.name);
        fs.renameSync(file.path, destPath);
        console.log(`Archived: ${file.name}`);
    });
    console.log(JSON.stringify(files, null, 2));
}
