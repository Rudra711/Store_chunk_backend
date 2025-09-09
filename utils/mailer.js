// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const smtpHost = process.env.SMTP_HOST;

export async function sendResetEmail(toEmail, resetUrl) {
  if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject: "Reset your password",
      html: `<p>Click to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });

    console.log("Email sent:", info.messageId);
    return info;
  } else {
    // fallback: log reset URL for development
    console.log(`No SMTP configured. Password reset link for ${toEmail}: ${resetUrl}`);
    return null;
  }
}
