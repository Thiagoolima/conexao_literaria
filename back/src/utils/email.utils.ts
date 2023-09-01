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
  return new Promise<void>(async (resolve, reject) => {
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
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
