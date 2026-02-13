const https = require('https');

async function verify(code, answer) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      verification_code: code,
      answer: answer
    });

    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/verify',
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
const code = args[0];
const answer = args[1];

if (!code || !answer) {
  console.log("Usage: node scripts/verify-moltbook.js <code> <answer>");
  process.exit(1);
}

verify(code, answer).then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
