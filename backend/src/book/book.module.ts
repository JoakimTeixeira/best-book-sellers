import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorService } from 'src/author/author.service';
import { AuthorRepository } from 'src/author/author.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BookService, BookRepository, AuthorService, AuthorRepository],
})
export class BookModule {}
