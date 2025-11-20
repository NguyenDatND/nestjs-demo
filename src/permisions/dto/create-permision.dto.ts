import { IsString } from 'class-validator';

export class CreatePermisionDto {
  @IsString()
  name: string;
}
