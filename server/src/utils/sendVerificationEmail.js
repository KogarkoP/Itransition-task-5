import mailTransporter from "./mailTransporter.js";

const sendVerificationMail = (user) => {
  const transporter = mailTransporter();
  const mailOptions = {
    from: `"TECH FORUM" ${process.env.SMTP_USER}`,
    to: user.email,
    subject: "Verify your email...",
    html: `<p>Hello ${user.name}, verify your email by clicking this link... </p> 
    <a href =${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}>Verify Your Email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification email sent");
    }
  });
};

export default sendVerificationMail;
