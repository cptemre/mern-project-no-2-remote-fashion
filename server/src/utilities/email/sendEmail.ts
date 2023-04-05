// SEND GRID MAILSETUP
import sgMail from "@sendgrid/mail";
const sgApiKey = process.env.SENDGRID_API_KEY as string;
sgMail.setApiKey(sgApiKey);
// MAIL INTERFACE
import { MailInterface } from "../interfaces/index";

const sendEmail = async ({ to, subject, html }: MailInterface) => {
  const msg = {
    to,
    from: "Remote Shopping <kunduraci2@gmail.com>",
    subject,
    html,
  };
  try {
    return sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
