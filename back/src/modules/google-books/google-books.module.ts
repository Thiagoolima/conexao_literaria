import { Module } from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';
import { GoogleBooksController } from './google-books.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GoogleBooksController],
  providers: [GoogleBooksService],
  exports: [GoogleBooksService],
})
export class GoogleBooksModule {}
