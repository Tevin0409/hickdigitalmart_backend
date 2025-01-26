import { sendMail } from "../config/email.config";
import { Options } from "nodemailer/lib/mailer";

const generateOTPEmailTemplate = (otp: string) => `
  <div style="font-family: Arial, sans-serif;  margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Hickdigital OTP Verification</h2>
    <p style="font-size: 16px; color: #555;">Hello,</p>
    <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 22px; font-weight: bold; color: #007bff; background-color: #e7f3ff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 16px; color: #555;">This OTP is valid for a limited time. If you did not request this, please ignore this email.</p>
    <p style="font-size: 14px; color: #999;">Thank you,<br>Hickdigital Team</p>
  </div>
`;
const generatePasswordChangedTemplate = (firstName: string) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Updated</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f5f5f7;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #1d1d1f;
        }
        .container {
            margin: 30px auto;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header {
            background-color: #007aff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #f5f5f7;
            color: #86868b;
            text-align: center;
            padding: 15px;
            font-size: 12px;
        }
        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        p {
            margin-bottom: 15px;
        }
        .alert {
            background-color: #f2f2f7;
            border-left: 4px solid #007aff;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Changed</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>Your account password has been successfully updated.</p>
            <div class="alert">
                If you did not make this change, please contact our support team immediately.
            </div>
            <p>Stay secure,<br>Hickdigital Team</p>
        </div>
        <div class="footer">
             Hickdigital. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
export const sendOTPEmail = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required to send Email");
  }

  const mailOptions = {
    to: email,
    subject: "Your One-Time Password (OTP) - Hickdigital",
    html: generateOTPEmailTemplate(otp),
  };
  sendEmail(mailOptions);
};
export const sendPasswordChangeEmail = async (
  email: string,
  firstName: string
) => {
  if (!email || !firstName) {
    throw new Error("Email and firstName are required to send emails");
  }

  const mailOptions = {
    to: email,
    subject: "Your Password has changed - Hickdigital",
    html: generatePasswordChangedTemplate(firstName),
  };
  sendEmail(mailOptions);
};

const sendEmail = (mailOptions: Options) => {
  try {
    sendMail(mailOptions);
    console.log(`OTP email sent to ${mailOptions.to}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
};
