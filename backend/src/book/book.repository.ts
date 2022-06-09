import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IBookWithAuthor } from './book.interface';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  public isSameName(bookDto: CreateBookDto) {
    const { name, authorId } = bookDto;

    return this.prisma.book.findMany({
      where: {
        AND: [
          {
            name,
          },
          {
            author: {
              id: authorId,
            },
          },
        ],
      },
    });
  }

  public create(bookDto: CreateBookDto): Promise<Book> {
    return this.prisma.book.create({
      data: {
        ...bookDto,
      },
    });
  }

  public findAll(): Promise<IBookWithAuthor[]> {
    return this.prisma.book.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        author: true,
      },
    });
  }

  public findOne(id: string): Promise<IBookWithAuthor> {
    return this.prisma.book.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        author: true,
      },
    });
  }
}
