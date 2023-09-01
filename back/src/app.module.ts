import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { GoogleBooksModule } from './modules/google-books/google-books.module';
import { BookCaseModule } from './modules/book-case/book-case.module';

@Module({
  imports: [UserModule, AuthModule, BookModule, GoogleBooksModule, BookCaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
