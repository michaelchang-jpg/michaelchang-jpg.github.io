// scripts/send-email.js
/**
 * Usage: node scripts/send-email.js "<to>" "<subject>" "<body>"
 * Credentials loaded from ~/.openclaw/credentials/email.json
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Load credentials safely
const credsPath = path.join(os.homedir(), '.openclaw', 'credentials', 'email.json');
let config = {};

try {
  if (fs.existsSync(credsPath)) {
    config = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load email credentials:', err.message);
  process.exit(1);
}

const user = config.user;
const pass = config.pass;

if (!user || !pass) {
  console.error('Missing email credentials in ~/.openclaw/credentials/email.json');
  process.exit(1);
}

const to = process.argv[2];
const subject = process.argv[3];
let text = process.argv[4];

if (!to || !subject || !text) {
  console.log('Usage: node scripts/send-email.js "<to>" "<subject>" "<body>"');
  process.exit(1);
}

// If the body argument is a file path, read the content from the file
if (fs.existsSync(text)) {
  try {
    text = fs.readFileSync(text, 'utf8');
  } catch (err) {
    console.error('Failed to read body file:', err.message);
    // Fallback: treat as raw text if read fails? No, better to fail or warn.
    // For now, let's assume if it exists, it's meant to be a file.
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

const mailOptions = {
  from: `Dorothy <${user}>`,
  to: to,
  subject: subject,
  text: text,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
