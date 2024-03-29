import { Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { isNotEmpty } from 'class-validator';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async doesExists(authorId: string): Promise<Boolean> {
    return await this.authorRepository
      .doesExists(authorId)
      .then((author) => isNotEmpty(author));
  }

  public async isSameName(authorName: string): Promise<Boolean> {
    return await this.authorRepository
      .isSameName(authorName)
      .then((author) => isNotEmpty(author));
  }

  public async createAuthor(authorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorRepository.create(authorDto);
  }

  public async getAuthors(): Promise<Author[]> {
    return await this.authorRepository.findAll();
  }

  public async getAuthorById(id: string): Promise<Author> {
    return await this.authorRepository.findOne(id);
  }
}
