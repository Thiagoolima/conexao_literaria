import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { PrismaService } from 'src/database/PrismaService';
import { BookController } from './book.controller';
import { GoogleBooksModule } from '../google-books/google-books.module';

@Module({
  imports: [GoogleBooksModule],
  controllers: [BookController],
  providers: [BookService, PrismaService],
})
export class BookModule {}
