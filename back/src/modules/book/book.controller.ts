import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { FindBookDto } from './dto/find-book.dto';
import { NewBookDto } from './dto/new-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('find')
  async find(@Body() query: FindBookDto) {
    try {
      const result = await this.bookService.find(query);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  @Post('newbook')
  async new(@Body() body: NewBookDto) {
    try {
      await this.bookService.newBook(body);
    } catch (error) {
      console.log(error);
    }
  }
}
