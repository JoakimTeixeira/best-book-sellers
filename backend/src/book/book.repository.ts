import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  public create(bookDto: CreateBookDto): Promise<Book> {
    const book = this.prisma.book.create({
      data: {
        ...bookDto,
      },
    });

    return book;
  }

  public findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({});
  }

  public findOne(id: string): Promise<Book> {
    return this.prisma.book.findFirst({
      where: {
        id,
      },
    });
  }
}
