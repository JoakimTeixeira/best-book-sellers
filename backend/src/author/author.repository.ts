import { Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorRepository {
  constructor(private readonly prisma: PrismaService) {}

  public doesExists(authorDto: CreateAuthorDto): Promise<Author> {
    return this.prisma.author.findFirst({
      where: {
        name: authorDto.name,
      },
    });
  }

  public create(authorDto: CreateAuthorDto): Promise<Author> {
    const author = this.prisma.author.create({
      data: {
        ...authorDto,
      },
    });

    return author;
  }

  public findAll(): Promise<Author[]> {
    return this.prisma.author.findMany({});
  }

  public findOne(id: string): Promise<Author> {
    return this.prisma.author.findFirst({
      where: {
        id: id,
      },
    });
  }
}
