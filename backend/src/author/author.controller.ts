import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  Res,
  HttpStatus,
  ParseArrayPipe,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { Response } from 'express';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';

export interface IResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  public async createAuthor(
    @Body(
      new ParseArrayPipe({
        items: CreateAuthorDto,
        whitelist: true,
      }),
    )
    createAuthorDto: CreateAuthorDto[],
    @Res()
    res: Response,
  ): Promise<Response> {
    try {
      const createdAuthors: Author[] = [];

      for (const author of createAuthorDto) {
        if (!author.name) {
          return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Some author fields are missing or invalid',
          });
        }

        const doesAuthorExists = await this.authorService.isSameName(
          author.name,
        );

        if (doesAuthorExists) {
          return res.status(HttpStatus.CONFLICT).send({
            message: 'Author already exists',
            author,
          });
        }

        const createdAuthor = await this.authorService.createAuthor(author);
        createdAuthors.push(createdAuthor);
      }

      return res.status(HttpStatus.OK).send({
        message: `${
          createdAuthors.length > 1 ? 'Authors have' : 'Author has'
        } been created successfully`,
        createdAuthors,
      });
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to create a new author',
      );
    }
  }

  @Get()
  public async getAuthors(@Res() res: Response): Promise<Response> {
    try {
      const authors = await this.authorService.getAuthors();

      if (!authors) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'No authors were found' });
      }

      return res.status(HttpStatus.OK).send(authors);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the authors',
      );
    }
  }

  @Get(':id')
  public async getAuthorById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const author = await this.authorService.getAuthorById(id);

      if (!author) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'The author was not found' });
      }

      return res.status(HttpStatus.OK).send(author);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the author',
      );
    }
  }
}
