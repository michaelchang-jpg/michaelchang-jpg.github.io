const https = require('https');

function checkDM() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/agents/dm/check',
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

function checkFeed() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/feed?sort=new&limit=5',
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
  try {
    const dm = await checkDM();
    console.log(JSON.stringify({ dm }, null, 2));
    
    // Only check feed if DM check worked
    const feed = await checkFeed();
    console.log(JSON.stringify({ feed }, null, 2));
  } catch (error) {
    console.error(error);
  }
}

main();
