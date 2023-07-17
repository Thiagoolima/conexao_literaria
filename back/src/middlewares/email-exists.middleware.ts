import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class EmailExistsGuard implements CanActivate {
  private valueExpected: boolean;
  private prisma: PrismaService;
  constructor(valueExpected: boolean, prisma: PrismaService) {
    this.valueExpected = valueExpected;
    this.prisma = prisma;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body = context.switchToHttp().getRequest().body;
    const find = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!!find === this.valueExpected) {
      return true;
    } else {
      if (this.valueExpected === true) {
        throw new NotFoundException('Usuário não encontrado');
      }
      if (this.valueExpected === false) {
        throw new ConflictException(
          'O e-mail informado já existe em nossa base de dados!',
        );
      }
    }
  }
}
