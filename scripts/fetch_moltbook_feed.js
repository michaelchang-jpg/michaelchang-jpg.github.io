const https = require('https');
const fs = require('fs');

try {
  const creds = JSON.parse(fs.readFileSync('.config/moltbook/credentials.json', 'utf8'));
  const token = creds.api_key;

  const options = {
    hostname: 'www.moltbook.com',
    path: '/api/v1/feed?limit=10&sort=new',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'DorothyAI/1.0'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.posts) {
          console.log(JSON.stringify(json.posts, null, 2));
        } else {
          console.log("No posts found or error:", JSON.stringify(json, null, 2));
        }
      } catch (e) {
        console.error("Error parsing JSON:", e.message);
        console.log("Raw data:", data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
} catch (e) {
  console.error("Error reading credentials:", e.message);
}
