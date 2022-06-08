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
  ): Promise<Response> {
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
  public async getBooks(@Res() res: Response): Promise<Response> {
    try {
      const books = await this.bookService.getBooks();

      if (books) {
        return res.status(HttpStatus.OK).send(books);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'No books were found' });
      }
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get books',
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

      if (book) {
        return res.status(HttpStatus.OK).send(book);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'The book was not found' });
      }
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the book',
      );
    }
  }
}
