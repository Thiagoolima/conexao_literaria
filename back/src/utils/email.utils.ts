import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import transporter from '../configs/nodemailer.config';
import {} from '@nestjs/common';

interface Send {
  to: string;
  subject: string;
  templatePath: string;
  body?: object;
}

export const sendMail = async (params: Send): Promise<void> => {
  try {
    const { to, subject, templatePath, body } = params;
    const htmlString = (await fs.readFile(templatePath)).toString();
    const compile = handlebars.compile(htmlString);
    const compiledHtml = compile(body);

    const mailOptions = {
      from: `Conexão Literária <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: compiledHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
