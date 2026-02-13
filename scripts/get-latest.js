const imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const credsPath = require('path').join(require('os').homedir(), '.openclaw', 'credentials', 'email.json');
const creds = JSON.parse(require('fs').readFileSync(credsPath, 'utf8'));

const config = {
  imap: {
    user: creds.user,
    password: creds.pass,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function getAbsoluteLatest() {
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    // Get the sequence number of the last message
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      struct: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    if (messages.length === 0) {
      console.log('Inbox is empty.');
    } else {
      const last = messages[messages.length - 1];
      const all = last.parts.find(part => part.which === '');
      const mail = await simpleParser(all.body);
      console.log('--- ABSOLUTE LATEST MESSAGE ---');
      console.log(`Date: ${mail.date}`);
      console.log(`From: ${mail.from.text}`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Body: ${mail.text ? mail.text.substring(0, 500) : '(No text)'}`);
    }

    connection.end();
  } catch (err) {
    console.error(err);
  }
}

getAbsoluteLatest();
