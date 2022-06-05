import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorRepository } from './author.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
})
export class AuthorModule {}
