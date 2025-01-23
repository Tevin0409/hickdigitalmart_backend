import nodemailer from "nodemailer";
import { GMAIL_PASS, GMAIL_AUTH } from ".";
import { Options } from "nodemailer/lib/mailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_AUTH,
    pass: GMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer Transporter Error:", error);
  } else {
    console.log("Nodemailer Transporter Ready to Send Emails");
  }
});

export const sendMail = (mailOptions: Options) => {
  mailOptions.from = "Dev Team";
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
