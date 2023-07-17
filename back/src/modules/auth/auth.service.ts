import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ReqLoginDTO, ResLonginDTO } from './auth.dto';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
}
