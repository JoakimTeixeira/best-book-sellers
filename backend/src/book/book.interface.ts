import { Author, Book } from '@prisma/client';

export interface IBookWithAuthor extends Pick<Book, 'authorId' & Author> {}
