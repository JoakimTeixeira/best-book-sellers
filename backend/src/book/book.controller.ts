import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  HttpStatus,
  Res,
  ParseArrayPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthorService } from 'src/author/author.service';
import { IBookWithAuthor } from './book.interface';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @Post()
  public async createBooks(
    @Body(
      new ParseArrayPipe({
        items: CreateBookDto,
        whitelist: true,
      }),
    )
    createBookDto: CreateBookDto[],
    @Res()
    res: Response,
  ): Promise<Response> {
    try {
      const createdBooks: IBookWithAuthor[] = [];

      for (const book of createBookDto) {
        const { title, authorId } = book;

        if (!title || !authorId) {
          return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Some book fields are missing or invalid',
          });
        }

        const doesAuthorExists = await this.authorService.doesExists(
          book.authorId,
        );

        if (!doesAuthorExists) {
          return res.status(HttpStatus.CONFLICT).send({
            message: 'Book author does not exist',
            book,
          });
        }

        const isSameBookTitleForAuthor =
          await this.bookService.isSameBookTitleForAuthor(book);

        if (isSameBookTitleForAuthor) {
          return res.status(HttpStatus.CONFLICT).send({
            message: 'Book title already exists for this author',
            book,
          });
        }

        const createdBook = await this.bookService.createBook(book);
        createdBooks.push(createdBook);
      }

      return res.status(HttpStatus.OK).send({
        message: `${
          createdBooks.length > 1 ? 'Books have' : 'Book has'
        } been created successfully`,
        createdBooks,
      });
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to create a new book',
      );
    }
  }

  @Get()
  public async getBooks(@Res() res: Response): Promise<Response> {
    try {
      const books = await this.bookService.getBooks();

      if (!books) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'No books were found' });
      }

      return res.status(HttpStatus.OK).send(books);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the books',
      );
    }
  }

  @Get(':id')
  public async getBookById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const book = await this.bookService.getBookById(id);

      if (!book) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'The book was not found' });
      }

      return res.status(HttpStatus.OK).send(book);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the book',
      );
    }
  }
}
