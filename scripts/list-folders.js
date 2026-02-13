const imap = require('imap-simple');

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

async function listFolders() {
  try {
    const connection = await imap.connect(config);
    const boxes = await connection.getBoxes();
    
    function printBoxes(boxes, prefix = '') {
      for (const name in boxes) {
        console.log(prefix + name);
        if (boxes[name].children) {
          printBoxes(boxes[name].children, prefix + name + boxes[name].delimiter);
        }
      }
    }
    
    printBoxes(boxes);
    connection.end();
  } catch (err) {
    console.error(err);
  }
}

listFolders();
