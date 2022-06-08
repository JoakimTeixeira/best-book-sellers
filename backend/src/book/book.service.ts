import { Injectable } from '@nestjs/common';
import { IBookWithAuthor } from './book.interface';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async createBook(createBookDto: CreateBookDto) {
    return await this.bookRepository.create(createBookDto);
  }

  public async getBooks(): Promise<IBookWithAuthor[]> {
    return await this.bookRepository.findAll();
  }

  public async getBookById(id: string): Promise<IBookWithAuthor> {
    return await this.bookRepository.findOne(id);
  }
}
