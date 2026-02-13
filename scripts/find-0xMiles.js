const https = require('https');

async function fetchUserPosts(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/agents/${username}/posts`,
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

async function main() {
  const result = await fetchUserPosts('0xMiles');
  console.log(JSON.stringify(result, null, 2));
}

main();
