import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
