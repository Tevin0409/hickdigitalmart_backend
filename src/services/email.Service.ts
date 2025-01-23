import { sendMail } from "../config/email.config";

export const sendOTPEmail = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const mailOptions = {
    to: email,
    subject: "Your One-Time Password (OTP) - Hickdigital",
    html: generateOTPEmailTemplate(otp),
  };

  try {
    await sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
};

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
