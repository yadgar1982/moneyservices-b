const otpEmailTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08);">

            <!-- Header -->
            <tr>
              <td align="center" style="padding:40px;background:linear-gradient(135deg,#06b6d4,#10b981);">

                <h1 style="margin:0;color:#ffffff;font-size:30px;">
                  Money Services
                </h1>

                <p style="margin-top:10px;color:#e8fdf8;font-size:15px;">
                  Secure Password Recovery
                </p>

              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">

                <h2 style="margin-top:0;color:#1e293b;">
                  Hello ${name},
                </h2>

                <p style="font-size:16px;line-height:28px;color:#475569;">
                  We received a request to reset your password.
                  Please use the verification code below to continue.
                </p>

                <!-- OTP -->
                <div
                  style="
                    margin:35px auto;
                    width:260px;
                    background:#f8fafc;
                    border:2px dashed #06b6d4;
                    border-radius:16px;
                    padding:20px;
                    text-align:center;
                  "
                >

                  <div
                    style="
                      font-size:38px;
                      letter-spacing:12px;
                      color:#0891b2;
                      font-weight:bold;
                    "
                  >
                    ${otp}
                  </div>

                </div>

                <p style="font-size:15px;color:#64748b;line-height:28px;">
                  This verification code is valid for
                  <strong>10 minutes</strong>.
                </p>

                <p style="font-size:15px;color:#64748b;line-height:28px;">
                  If you didn't request this password reset,
                  you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background:#f8fafc;
                  padding:25px;
                  color:#94a3b8;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} Money Services<br/>
                Secure Financial Management Platform
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

export default otpEmailTemplate;