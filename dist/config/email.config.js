"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const _1 = require(".");
exports.transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: _1.GMAIL_AUTH,
        pass: _1.GMAIL_PASS,
    },
});
exports.transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer Transporter Error:", error);
    }
    else {
        console.log("Nodemailer Transporter Ready to Send Emails");
    }
});
const sendMail = (mailOptions) => {
    mailOptions.from = "Dev Team";
    exports.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        }
        else {
            console.log("Email sent: ", info.response);
        }
    });
};
exports.sendMail = sendMail;
