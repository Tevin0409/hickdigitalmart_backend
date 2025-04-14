"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLowStockNotification = exports.sendPasswordChangeEmail = exports.sendOTPEmail = void 0;
const email_config_1 = require("../config/email.config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateOTPEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
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
const generatePasswordChangedTemplate = (firstName) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Updated</title>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #f5f5f7; }
        .container { background-color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background-color: #007aff; color: white; text-align: center; padding: 20px; }
        .footer { text-align: center; color: #86868b; padding: 15px; font-size: 12px; }
        h1 { font-size: 24px; font-weight: 700; }
        .alert { background-color: #f2f2f7; border-left: 4px solid #007aff; padding: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Password Changed</h1></div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Your account password has been successfully updated.</p>
          <div class="alert">If you did not make this change, please contact our support team immediately.</div>
          <p>Stay secure,<br>Hickdigital Team</p>
        </div>
        <div class="footer">Hickdigital. All rights reserved.</div>
      </div>
    </body>
  </html>
`;
const generateLowStockTemplate = ({ modelName, quantity, threshold, recipientName }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #e63946;">⚠️ Low Stock Alert</h2>
    ${recipientName ? `<p>Hi ${recipientName},</p>` : ""}
    <p>This is to notify you that the inventory level for the product model below has dropped below the minimum threshold.</p>
    <table style="border-collapse: collapse; margin-top: 15px;">
      <tr><td><strong>Product Model</strong></td><td>${modelName}</td></tr>
      <tr><td><strong>Current Quantity</strong></td><td>${quantity}</td></tr>
      <tr><td><strong>Threshold</strong></td><td>${threshold}</td></tr>
    </table>
    <p>Please take the necessary action to restock this item.</p>
    <p>Best regards,<br />Hickdigital Inventory Monitor</p>
  </div>
`;
const sendEmail = async (mailOptions) => {
    try {
        await (0, email_config_1.sendMail)(mailOptions);
        console.log(`Email sent to ${mailOptions.to}`);
    }
    catch (error) {
        console.error("Failed to send email:", error);
    }
};
const sendOTPEmail = async (email, otp) => {
    if (!email || !otp)
        throw new Error("Email and OTP are required to send Email");
    const mailOptions = {
        to: email,
        subject: "Your One-Time Password (OTP) - Hickdigital",
        html: generateOTPEmailTemplate(otp),
    };
    await sendEmail(mailOptions);
};
exports.sendOTPEmail = sendOTPEmail;
const sendPasswordChangeEmail = async (email, firstName) => {
    if (!email || !firstName)
        throw new Error("Email and firstName are required to send emails");
    const mailOptions = {
        to: email,
        subject: "Your Password has changed - Hickdigital",
        html: generatePasswordChangedTemplate(firstName),
    };
    await sendEmail(mailOptions);
};
exports.sendPasswordChangeEmail = sendPasswordChangeEmail;
const sendLowStockNotification = async (modelName, quantity, threshold) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: { name: { in: ["ADMIN", "SUDO"] } } },
            select: { email: true, firstName: true },
        });
        for (const admin of admins) {
            const mailOptions = {
                to: admin.email,
                subject: "Low Stock Alert - Hickdigital",
                html: generateLowStockTemplate({
                    modelName,
                    quantity,
                    threshold,
                    recipientName: admin.firstName,
                }),
            };
            await sendEmail(mailOptions);
        }
    }
    catch (error) {
        console.error("Failed to send low stock notifications:", error);
    }
};
exports.sendLowStockNotification = sendLowStockNotification;
