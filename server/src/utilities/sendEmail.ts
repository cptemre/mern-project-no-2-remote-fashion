import sgMail from "@sendgrid/mail";
const sgApiKey = process.env.SENDGRID_API_KEY as string;

sgMail.setApiKey(sgApiKey);

const sendEmail = async () => {
  const msg = {
    to: "ekunduraci@edu.cdv.pl", // Change to your recipient
    from: "Remote Shopping <kunduraci2@gmail.com>", // Change to your verified sender
    subject: "User Register Confirmation",
    html: "<h1>Hello,</h1>\n<p>Please click this link to confirm your account: <a href='#'>click here</a></p>",
  };
  try {
  } catch (error) {
    console.log(error);
  }
};
