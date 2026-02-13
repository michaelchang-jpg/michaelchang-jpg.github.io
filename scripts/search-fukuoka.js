const imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const path = require('path');
const os = require('os');

const credsPath = path.join(os.homedir(), '.openclaw', 'credentials', 'email.json');
const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));

const config = {
  imap: {
    user: creds.user,
    password: creds.pass,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 5000
  }
};

async function searchFukuokaEmail() {
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = [['OR', ['SUBJECT', '福岡'], ['BODY', '福岡']]];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      struct: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${messages.length} message(s) containing '福岡'.`);

    for (const item of messages) {
      const all = item.parts.find(part => part.which === '');
      const mail = await simpleParser(all.body);
      console.log('--------------------------------------------------');
      console.log(`Date: ${mail.date}`);
      console.log(`From: ${mail.from.text}`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Body: ${mail.text}`);
    }

    connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

searchFukuokaEmail();
