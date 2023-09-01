import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';

@Injectable()
export class BookCaseService {
  constructor(private prisma: PrismaService) {}
}
