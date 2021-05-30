const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log(process.env.EMAIL_HOST);
  console.log(process.env.EMAIL_PORT);
  console.log(process.env.EMAIL_USERNAME);
  console.log(process.env.EMAIL_PASSWORD);
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const emailOptions = {
    from: "Tours.io <alex@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // sendEmail
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
