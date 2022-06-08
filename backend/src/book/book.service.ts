import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async createBook(createBookDto: CreateBookDto) {
    return await this.bookRepository.create(createBookDto);
  }

  public async getBooks(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }

  public async getBookById(id: string): Promise<Book> {
    return await this.bookRepository.findOne(id);
  }
}
