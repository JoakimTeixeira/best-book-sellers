import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}
