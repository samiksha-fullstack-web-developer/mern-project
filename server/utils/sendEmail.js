const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

if (!process.env.RESEND_API) {
  console.log("Provide RESEND_API in the .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: sendTo,
      subject,
      html,
    });

    if (error) {
      return console.log(error);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
