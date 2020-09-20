const nodemailer = require('nodemailer');

// Mailer
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'justus.bernhard17@ethereal.email',
        pass: 'XtsQPnXhnNc8Wfjejv'
    }
});

module.exports = transporter;