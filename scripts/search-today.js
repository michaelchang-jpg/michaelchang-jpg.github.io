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

async function searchTodayMail() {
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    // Search for messages since today (Feb 9, 2026)
    const searchCriteria = [['SINCE', '9-Feb-2026']];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      struct: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${messages.length} message(s) since Feb 9.`);

    for (const item of messages) {
      const all = item.parts.find(part => part.which === '');
      const mail = await simpleParser(all.body);
      console.log('--------------------------------------------------');
      console.log(`Date: ${mail.date}`);
      console.log(`From: ${mail.from.text}`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Body: ${mail.text ? mail.text.substring(0, 100) : '(No text)'}`);
    }

    connection.end();
  } catch (err) {
    console.error(err);
  }
}

searchTodayMail();
