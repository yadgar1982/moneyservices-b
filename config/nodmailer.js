import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Test SMTP connection
  await transporter.verify();

  // Send email
  return transporter.sendMail({
    from: `"Money Services" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};