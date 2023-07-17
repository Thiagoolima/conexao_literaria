import * as nodemailer from 'nodemailer';
const { MAIL_USER, MAIL_PROVIDER, MAIL_PASS } = process.env;

export default nodemailer.createTransport({
  service: MAIL_PROVIDER,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
