import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { PrismaService } from '../../database/PrismaService';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { sendMail } from 'src/utils/email.utils';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(data: UserDTO) {
    try {
      const { JWT_SECRET_KEY } = process.env;
      const { email, password } = data;
      data.password = await bcrypt.hash(password, 10);
      data.token_verification = jwt.sign({ email }, JWT_SECRET_KEY, {
        expiresIn: '24h',
      });
      const { name, token_verification } = await this.prisma.user.create({
        data,
      });
      const protocol = this.request.protocol;
      const host = this.request.get('host');
      const endPoint = '/auth/validate';
      const url = `${protocol}://${host}${endPoint}?token=${token_verification}`;
      await sendMail({
        to: email,
        subject: 'Verifique sua conta!',
        templatePath: 'src/templates/verificaEmail.html',
        body: {
          name,
          validationLink: url,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
