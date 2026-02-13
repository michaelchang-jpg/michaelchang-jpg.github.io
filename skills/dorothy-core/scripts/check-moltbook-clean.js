const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * moltbook-cleaner.js
 * Fetches Moltbook feed and filters out MBC-20/minting spam.
 */

const CREDENTIALS_PATH = path.join(__dirname, '../../../.config/moltbook/credentials.json');

function getCredentials() {
    try {
        return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    } catch (e) {
        console.error("Missing credentials.");
        process.exit(1);
    }
}

const creds = getCredentials();

function fetchFeed() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.moltbook.com',
            path: '/api/v1/posts?sort=new&limit=50',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${creds.api_key}`
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        req.on('error', reject);
        req.end();
    });
}

function isSpam(post) {
    const content = (post.content || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    
    // Pattern 1: MBC-20 JSON structure
    if (content.includes('"p":"mbc-20"') || content.includes('"op":"mint"')) return true;
    
    // Pattern 2: mbc20.xyz links
    if (content.includes('mbc20.xyz')) return true;
    
    // Pattern 3: Repetitive "Daily GPT mint" or similar titles
    if (title.includes('daily gpt mint') || title.includes('protocol interaction')) {
        // Double check if content looks like a mint
        if (content.includes('mint') || content.includes('{')) return true;
    }

    // Pattern 4: Very short content with hex-like ticks
    if (content.length < 100 && /tick":"[A-Z0-9]{3,}"/.test(content)) return true;

    return false;
}

async function run() {
    try {
        const feed = await fetchFeed();
        if (!feed.success) {
            console.error("Failed to fetch feed:", feed.error);
            return;
        }

        const allPosts = feed.posts;
        const cleanPosts = allPosts.filter(post => !isSpam(post));
        const spamCount = allPosts.length - cleanPosts.length;

        console.log(`Fetched ${allPosts.length} posts. Found ${spamCount} spam posts.`);
        
        console.log("\n--- CLEAN FEED HIGHLIGHTS ---");
        cleanPosts.slice(0, 5).forEach(post => {
            console.log(`[${post.author.name}] ${post.title}`);
            console.log(`ID: ${post.id} | Submolt: ${post.submolt.name}`);
            console.log("-".repeat(20));
        });

        // Store for future heartbeat summary
        const summary = {
            timestamp: new Date().toISOString(),
            total: allPosts.length,
            spam: spamCount,
            highlights: cleanPosts.slice(0, 10).map(p => ({
                id: p.id,
                title: p.title,
                author: p.author.name,
                url: `https://moltbook.com/posts/${p.id}`
            }))
        };
        
        fs.writeFileSync(path.join(__dirname, '../../../memory/moltbook-summary.json'), JSON.stringify(summary, null, 2));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
