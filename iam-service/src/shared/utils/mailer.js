const env = require('../config/environment');

/**
 * Gửi email đơn giản qua SMTP.
 * Yêu cầu cấu hình SMTP_* trong .env.
 *
 * Để dùng thực tế: npm install nodemailer
 * và bỏ comment phần nodemailer bên dưới.
 */
const sendMail = async ({ to, subject, html }) => {
  if (!env.SMTP_HOST) {
    console.log('[MAILER] ----------------------------');
    console.log(`[MAILER] To:      ${to}`);
    console.log(`[MAILER] Subject: ${subject}`);
    console.log(`[MAILER] Body:    ${html}`);
    console.log('[MAILER] ----------------------------');
    console.log('[MAILER] SMTP_HOST not configured, email logged to console instead.');
    return;
  }

  // Production/Development: dùng nodemailer nếu có SMTP config
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  try {
    await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
    console.log(`[MAILER] Email successfully sent to ${to}`);
  } catch (err) {
    console.error(`[MAILER] Error sending email to ${to}:`, err);
    throw err;
  }
};

const sendResetPasswordEmail = (to, resetLink) =>
  sendMail({
    to,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. The link expires in 15 minutes.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">CLICK HERE</a>
      <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
    `,
  });

module.exports = { sendMail, sendResetPasswordEmail };
