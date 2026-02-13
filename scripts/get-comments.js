const https = require('https');

async function getComments(postId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}/comments`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer moltbook_sk_2hT8ajvWOnHVc831IgbZJgkVIOiLifeq',
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

    req.end();
  });
}

const args = process.argv.slice(2);
const postId = args[0];

if (!postId) {
  console.log("Usage: node scripts/get-comments.js <postId>");
  process.exit(1);
}

getComments(postId).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
