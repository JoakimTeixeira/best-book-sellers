import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { IBookWithAuthor } from './book.interface';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async isSameBookTitleForAuthor(
    createBookDto: CreateBookDto,
  ): Promise<Boolean> {
    return await this.bookRepository
      .isSameTitle(createBookDto)
      .then((books) => books.length > 0);
  }

  public async createBook(createBookDto: CreateBookDto): Promise<Book> {
    return await this.bookRepository.create(createBookDto);
  }

  public async getBooks(): Promise<IBookWithAuthor[]> {
    return await this.bookRepository.findAll();
  }

  public async getBookById(id: string): Promise<IBookWithAuthor> {
    return await this.bookRepository.findOne(id);
  }
}
