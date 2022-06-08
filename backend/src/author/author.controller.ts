import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  Res,
  HttpStatus,
} from '@nestjs/common';
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
    @Res() res: Response,
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<Response> {
    try {
      const doesAuthorExists = await this.authorService.isSameName(
        createAuthorDto.name,
      );

      if (doesAuthorExists) {
        return res.status(HttpStatus.CONFLICT).send({
          message: 'Author already exists',
        });
      }

      const author = await this.authorService.createAuthor(createAuthorDto);

      return res.status(HttpStatus.OK).send({
        message: 'Author has been created successfully',
        author,
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

      if (authors) {
        return res.status(HttpStatus.OK).send(authors);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'No authors were found' });
      }
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get authors',
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

      if (author) {
        return res.status(HttpStatus.OK).send(author);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'The author was not found' });
      }
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the author',
      );
    }
  }
}
