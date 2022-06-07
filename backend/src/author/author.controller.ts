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
    @Res() res: Response,
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<Response> {
    try {
      const doesAuthorExists = await this.authorService.doesAuthorExists(
        createAuthorDto,
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
  public async getAuthors(): Promise<Author[]> {
    try {
      return await this.authorService.getAuthors();
    } catch {
      throw new InternalServerErrorException(
        ' It was not possible to get authors',
      );
    }
  }

  @Get(':id')
  public async getAuthorById(@Param('id') id: string): Promise<Author> {
    try {
      return await this.authorService.getAuthorById(id);
    } catch {
      throw new InternalServerErrorException(
        'It was not possible to get the author',
      );
    }
  }
}
