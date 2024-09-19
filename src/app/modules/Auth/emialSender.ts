import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (userEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.email_send_from,
      pass: config.email_sender_google_pass,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Pet Adoption 👻" <mohammadsakib7679@gmail.com>', // sender address
      to: userEmail, // list of receivers
      subject: "Reset Password ✔", // Subject line
      //text: "Hello world?", // plain text body
      html: html, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
};

export default emailSender;
