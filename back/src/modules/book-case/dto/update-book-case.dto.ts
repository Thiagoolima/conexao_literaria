import { PartialType } from '@nestjs/mapped-types';
import { CreateBookCaseDto } from './create-book-case.dto';

export class UpdateBookCaseDto extends PartialType(CreateBookCaseDto) {}
