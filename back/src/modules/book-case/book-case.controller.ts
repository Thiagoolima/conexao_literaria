// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { BookCaseService } from './book-case.service';
// import { CreateBookCaseDto } from './dto/create-book-case.dto';
// import { UpdateBookCaseDto } from './dto/update-book-case.dto';

// @Controller('book-case')
// export class BookCaseController {
//   constructor(private readonly bookCaseService: BookCaseService) {}

//   @Post()
//   create(@Body() createBookCaseDto: CreateBookCaseDto) {
//     return this.bookCaseService.create(createBookCaseDto);
//   }

//   @Get()
//   findAll() {
//     return this.bookCaseService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.bookCaseService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateBookCaseDto: UpdateBookCaseDto) {
//     return this.bookCaseService.update(+id, updateBookCaseDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.bookCaseService.remove(+id);
//   }
// }
