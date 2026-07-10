/**
 * Email delivery. Wraps Nodemailer with branded HTML templates.
 * If SMTP is not configured, emails are logged instead of sent (dev-friendly).
 */
import { getTransporter } from '../config/mailer.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const brandShell = (title, bodyHtml) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#060a16;padding:32px;color:#e2e8f0">
    <div style="max-width:520px;margin:auto;background:#0a1122;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(120deg,#2563eb,#06b6d4);padding:20px 28px">
        <h1 style="margin:0;color:#fff;font-size:20px">Nav Jyoti</h1>
      </div>
      <div style="padding:28px">
        <h2 style="margin:0 0 12px;color:#fff;font-size:18px">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#64748b">
        © ${new Date().getFullYear()} Nav Jyoti. This is an automated message.
      </div>
    </div>
  </div>
`;

const send = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    logger.info(`[mail:skipped] to=${to} subject="${subject}"`);
    return { skipped: true };
  }
  const info = await transporter.sendMail({
    from: `"${env.mail.fromName}" <${env.mail.fromAddress}>`,
    to,
    subject,
    html,
  });
  return { messageId: info.messageId };
};

export const sendWelcomeEmail = (user) =>
  send({
    to: user.email,
    subject: 'Welcome to Nav Jyoti',
    html: brandShell(
      `Welcome, ${user.name}!`,
      `<p style="color:#94a3b8;line-height:1.6">Your account is ready. You can now apply for loans,
       track applications, and manage everything from your dashboard.</p>`
    ),
  });

export const sendPasswordResetEmail = (user, resetToken) => {
  const link = `${env.clientUrl}/reset-password/${resetToken}`;
  return send({
    to: user.email,
    subject: 'Reset your Nav Jyoti password',
    html: brandShell(
      'Password reset requested',
      `<p style="color:#94a3b8;line-height:1.6">We received a request to reset your password.
        This link expires shortly. If you didn't request it, you can safely ignore this email.</p>
       <p style="margin:24px 0">
         <a href="${link}" style="background:linear-gradient(120deg,#2563eb,#06b6d4);color:#fff;
            text-decoration:none;padding:12px 22px;border-radius:9999px;font-weight:600">Reset Password</a>
       </p>
       <p style="color:#64748b;font-size:12px;word-break:break-all">Or paste this link: ${link}</p>`
    ),
  });
};

export default { sendWelcomeEmail, sendPasswordResetEmail };
