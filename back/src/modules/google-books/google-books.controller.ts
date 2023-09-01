import { Controller } from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';

@Controller('google-books')
export class GoogleBooksController {
  constructor(private readonly googleApi: GoogleBooksService) {}
  async googleBook(query) {
    await this.googleApi.findBookApi(query);
  }
}
