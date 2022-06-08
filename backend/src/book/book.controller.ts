import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { Response } from 'express';
import { AuthorService } from 'src/author/author.service';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @Post()
  public async createBook(
    @Res() res: Response,
    @Body() createBookDto: CreateBookDto,
  ) {
    try {
      const doesExists = await this.authorService.doesExists(
        createBookDto.authorId,
      );

      if (doesExists) {
        const book = await this.bookService.createBook(createBookDto);

        if (book.name !== createBookDto.name) {
          return res.status(HttpStatus.OK).send({
            message: 'Author has been created successfully',
            book,
          });
        } else {
          return res.status(HttpStatus.CONFLICT).send({
            message: 'Book name already exists for this author',
          });
        }
      } else {
        return res.status(HttpStatus.CONFLICT).send({
          message: 'Book author does not exist',
        });
      }
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to create a new book',
      );
    }
  }

  @Get()
  public async getBooks(): Promise<Book[]> {
    try {
      return await this.bookService.getBooks();
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get books',
      );
    }
  }

  @Get(':id')
  public async getBookById(@Param('id') id: string): Promise<Book> {
    try {
      return await this.bookService.getBookById(id);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the book',
      );
    }
  }
}