// scripts/check-email.js
const imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const path = require('path');
const os = require('os');

// Load credentials safely
const credsPath = path.join(os.homedir(), '.openclaw', 'credentials', 'email.json');
let creds = {};

try {
  if (fs.existsSync(credsPath)) {
    creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load email credentials:', err.message);
  process.exit(1);
}

if (!creds.user || !creds.pass) {
  console.error('Missing email credentials in ~/.openclaw/credentials/email.json');
  process.exit(1);
}

const config = {
  imap: {
    user: creds.user,
    password: creds.pass,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000
  }
};

async function checkEmails() {
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    // Search for UNSEEN messages
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    if (messages.length === 0) {
      console.log('No new messages.');
      connection.end();
      return;
    }

    console.log(`Found ${messages.length} new message(s)!`);

    for (const item of messages) {
      const all = item.parts.find(part => part.which === '');
      const id = item.attributes.uid;
      const idHeader = 'Imap-Id: ' + id + '\r\n';

      const mail = await simpleParser(idHeader + all.body);
      
      const from = mail.from.text;
      const subject = mail.subject;
      const body = mail.text || mail.html || '(No content)';
      
      console.log('--------------------------------------------------');
      console.log(`From: ${from}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body preview: ${body.substring(0, 100).replace(/\n/g, ' ')}...`);
      
      // Save to a "inbox" log file
      const logEntry = `
---
Date: ${new Date().toISOString()}
From: ${from}
Subject: ${subject}
Body:
${body}
`;
      fs.appendFileSync(path.join(__dirname, '../memory/inbox.log'), logEntry);
    }

    connection.end();
  } catch (err) {
    console.error('Error checking emails:', err);
  }
}

checkEmails();
