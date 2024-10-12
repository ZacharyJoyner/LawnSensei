const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', recipient);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
};

module.exports = sendEmail;
