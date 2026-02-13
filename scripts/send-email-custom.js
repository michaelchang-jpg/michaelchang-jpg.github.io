// scripts/send-email-custom.js
/**
 * Usage: node scripts/send-email-custom.js <user> <pass> <to> <subject> <body>
 */
const nodemailer = require('nodemailer');

const user = process.argv[2];
const pass = process.argv[3];
const to = process.argv[4];
const subject = process.argv[5];
const text = process.argv[6];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

const mailOptions = {
  from: user,
  to: to,
  subject: subject,
  text: text,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error.message);
    // Print more details if available to debug auth issues
    if (error.response) console.log('Response:', error.response);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
