import { Injectable, HttpException } from '@nestjs/common';
import { FindBookDto } from './dto/find-book.dto';
import { GoogleBooksService } from '../google-books/google-books.service';
import { NewBookDto } from './dto/new-book.dto';

@Injectable()
export class BookService {
  constructor(private googleApi: GoogleBooksService) {}
  async find(params: FindBookDto) {
    try {
      const arr = Object.entries(params);
      const query = arr
        .map((entrada) => {
          return entrada.join(':');
        })
        .join('+')
        .replaceAll(' ', '+');
      const select = await this.googleApi.findBookApi(query);
      return {
        totalItems: select.data.totalItems,
        data: select.data.items,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  async newBook(props: NewBookDto) {
    try {
      console.log(props);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
