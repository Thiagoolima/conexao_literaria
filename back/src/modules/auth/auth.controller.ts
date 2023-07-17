import {
  Controller,
  Get,
  Query,
  HttpException,
  Post,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReqLoginDTO } from './auth.dto';
import { EmailExistsGuard } from 'src/middlewares/email-exists.middleware';
import { PrismaService } from 'src/database/PrismaService';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/validate')
  async activeUser(@Query('token') token: string) {
    try {
      const activate = await this.authService.activateUser(token);
      return activate;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/login')
  @UseGuards(new EmailExistsGuard(true, new PrismaService()))
  @HttpCode(200)
  async loginUser(@Body() data: ReqLoginDTO) {
    try {
      return await this.authService.login(data);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }
}
