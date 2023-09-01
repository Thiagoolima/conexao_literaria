import { Injectable, HttpException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { PrismaService } from '../../database/PrismaService';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { GetUrl } from 'src/utils/generateUrl.utils';
import { sendMail } from 'src/utils/email.utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private getUrl: GetUrl) {}

  async create(data: UserDTO) {
    try {
      const { JWT_SECRET_KEY } = process.env;
      const { name, email, password } = data;
      data.password = await bcrypt.hash(password, 10);
      data.token_verification = jwt.sign({ email }, JWT_SECRET_KEY, {
        expiresIn: '24h',
      });
      await this.prisma.user.create({
        data,
      });
      const url = this.getUrl.generateUrl(
        data.token_verification,
        '/auth/validate',
      );
      sendMail({
        to: email,
        subject: 'Verifique sua conta!',
        templatePath: 'src/templates/verificaEmail.html',
        body: {
          name,
          validationLink: url,
        },
      }).catch((error) => {
        throw new HttpException('Erro ao enviar o e-mail do usuário', 500);
      });
    } catch (error) {
      throw error;
    }
  }
}
