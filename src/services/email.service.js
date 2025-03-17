const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  try {
    await transport.sendMail(msg);
  } catch (error) {
    handleEmailError(error, msg);
  }
};

const handleEmailError = async (error, msg) => {
  if (error.responseCode === 454) {
    logger.error("Too many login attempts, retrying after delay...");
    await delay(60000); // Delay for 1 minute
    try {
      await transport.sendMail(msg);
    } catch (error) {
      logger.error("Failed to send email after retry: ", error);
    }
  } else {
    logger.error("Failed to send email: ", error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendEmailVerification = async (to, otp) => {
  console.log("sendEmailVerification", to, otp);
  const subject = "User verification code";
  const html = `
    <body style="background-color: #f3f4f6; padding: 1rem; font-family: Arial, sans-serif;">
      <div style="max-width: 24rem; margin: 0 auto; background-color: #fff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Welcome to Audio Book App</h1>
        <p style="color: #4b5563; margin-bottom: 1rem;">Thank you for joining Audio Book App. Your account is almost ready!</p>
        <div style="background-color: #e5e7eb; padding: 1rem; border-radius: 0.25rem; text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">${otp}</div>
        <p style="color: #4b5563; margin-bottom: 1rem;">Enter this code to verify your account.</p>
        <p style="color: red; font-size: 0.8rem; margin-top: 1rem;">This code expires in <span id="timer">3:00</span> minutes.</p>
      </div>
    </body>
  `;
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp) => {
  console.log("Otp", to, otp);
  const subject = "Verification Code";
  const html = `
    <body style="background-color: #f3f4f6; padding: 1rem; font-family: Arial, sans-serif;">
      <div style="max-width: 24rem; margin: 0 auto; background-color: #fff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Verification Code</h1>
        <div style="background-color: #e5e7eb; padding: 1rem; border-radius: 0.25rem; text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">${otp}</div>
      </div>
    </body>
  `;
  await sendEmail(to, subject, html);
};

const sendInvitationLinkToAdminEmail = async (to, password, message) => {
  console.log("Otp", to, password);
  const subject = "Audio Book Admin Invitation";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50; text-align: center;">Welcome to Audio Book!</h2>
            <p style="font-size: 16px; color: #333;">Congratulations! You have been promoted to an <strong>Admin</strong> on <strong>Audio Book</strong>. Below are your credentials to access your account:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${to}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Password</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
              </tr>
            </table>
            <p style="font-size: 16px; color: #333;">${message}</p>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://audiobook.com/login" style="background-color: #4CAF50; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Login to AudioBook</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">If you did not request this, please contact us immediately at support@audiobook.com.</p>
          </div>
  `;

  // <!--<p style="font-size: 16px; color: #333;">For your security, we recommend changing your password upon first login.</p> -->
  await sendEmail(to, subject, html);
};


const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendInvitationLinkToAdminEmail
};
