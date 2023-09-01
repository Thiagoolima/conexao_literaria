import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../database/PrismaService';
import { GetUrl } from 'src/utils/generateUrl.utils';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, GetUrl],
})
export class AuthModule {}
