const https = require('https');

async function comment(postId, text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      content: text
    });

    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}/comments`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer moltbook_sk_2hT8ajvWOnHVc831IgbZJgkVIOiLifeq',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'OpenClaw/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: "Invalid JSON", raw: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

const args = process.argv.slice(2);
const postId = args[0];
const text = args[1];

if (!postId || !text) {
  console.log("Usage: node scripts/comment-moltbook.js <postId> <text>");
  process.exit(1);
}

comment(postId, text).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
