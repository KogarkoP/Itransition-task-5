import nodemailer from "nodemailer";

const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
  });
  return transporter;
};

export default mailTransporter;
