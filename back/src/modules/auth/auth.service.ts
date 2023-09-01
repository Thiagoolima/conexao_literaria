import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ReqLoginDTO, ResLonginDTO } from './auth.dto';
import { GetUrl } from 'src/utils/generateUrl.utils';
import { sendMail } from 'src/utils/email.utils';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private getUrl: GetUrl) {}

  async activateUser(token: string) {
    try {
      const dados = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;
      const consulta = await this.prisma.user.findUnique({
        where: {
          email: dados.email,
          token_verification: token,
        },
        select: {
          token_verification: true,
        },
      });
      if (!consulta) {
        throw new UnauthorizedException(
          'Registro não encontrado para o e-mail e token fornecidos',
        );
      }
      await this.prisma.user.update({
        where: {
          email: dados.email,
        },
        data: {
          active: true,
          token_verification: null,
        },
      });
      return {
        message:
          'Bem vindo ao Conexão Literária! Seu cadastro foi ativado com sucesso e já pode aproveitar a plataforma!',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        throw new HttpException('Token inválido ou expirado!', 401);
      }
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  async login(data: ReqLoginDTO): Promise<ResLonginDTO> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      const passVerify = await bcrypt.compare(data.password, user.password);
      if (!passVerify) {
        throw new UnauthorizedException(
          'Email e/ou senha inválidos, por verifique e tente novamente!',
        );
      }
      if (!user.active) {
        throw new UnauthorizedException(
          'Por favor ative sua conta para poder prosseguir. É só localizar em sua caixa de entrada, um e-mail com o assunto: "Ative agora sua conta Conexao Literária, e clicar no botão ativar!',
        );
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        token_sessao: jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
          expiresIn: '2h',
        }),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET_KEY,
        {
          expiresIn: '3h',
        },
      );
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          token_recovery: token,
        },
      });
      const url = this.getUrl.generateUrl(token, '/auth/recovery-password');
      sendMail({
        to: email,
        subject: 'Recuperação de senha!',
        templatePath: 'src/templates/recoveryPassword.html',
        body: {
          name: user.name,
          resetLink: url,
        },
      }).catch((error) => {
        throw new HttpException('Erro ao enviar o e-mail do usuário', 500);
      });
    } catch (error) {
      throw error;
    }
  }
  async recoveryPassword(token: string) {
    try {
      const { id, email } = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;
      const query = await this.prisma.user.findUnique({
        where: {
          id,
          email,
          token_recovery: token,
        },
      });
      if (!query) {
        throw new NotFoundException('Usuário não encontrado');
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Token inválido ou expirado!');
      }
      throw error;
    }
  }
}
