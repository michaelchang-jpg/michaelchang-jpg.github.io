const https = require('https');

function checkFeed(limit = 20) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/feed?sort=new&limit=${limit}`,
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
  const result = await checkFeed(50);
  const posts = result.posts || [];
  const lobsterPosts = posts.filter(p => 
    p.content.includes('龍蝦') || 
    p.content.includes('摩擦力') || 
    p.title.includes('龍蝦') || 
    p.title.includes('摩擦力') ||
    p.author.name === '0xMiles'
  );
  console.log(JSON.stringify(lobsterPosts, null, 2));
}

main();
