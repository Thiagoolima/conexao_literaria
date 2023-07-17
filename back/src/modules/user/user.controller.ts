import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { EmailExistsGuard } from '../../middlewares/email-exists.middleware';
import { PrismaService } from 'src/database/PrismaService';

@Controller('user/newuser')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(new EmailExistsGuard(false, new PrismaService()))
  async create(@Body() data: UserDTO) {
    try {
      await this.userService.create(data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response ||
          'Ocorreu um erro inesperado, por favor tente novamente mais tarde!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
