import nodemailer from "nodemailer";

export const sendEmail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail(
      {
        from: `"Money Services" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      },
      (err, info) => {
        if (err) {
          return reject(err);
        }

        resolve(info);
      }
    );
  });
};