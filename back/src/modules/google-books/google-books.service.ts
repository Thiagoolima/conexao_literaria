import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
const urlBase = process.env.BOOK_URL_BASE;
@Injectable()
export class GoogleBooksService {
  constructor(private axios: HttpService) {}
  async findBookApi(query: string) {
    const endpoint = await this.axios.get(urlBase + query);
    const book = await lastValueFrom(endpoint);
    return book;
  }
}
