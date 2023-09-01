import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../database/PrismaService';
import { GetUrl } from 'src/utils/generateUrl.utils';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, GetUrl],
})
export class UserModule {}
