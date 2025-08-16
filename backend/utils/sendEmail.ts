// utils/sendEmail.ts
import nodemailer from "nodemailer";

export const sendOTPEmail = async (toEmail: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const result = await transporter.sendMail({
    from: `"Your CRM" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2><p>It will expire in 10 minutes.</p>`,
  });
  return result;
};
