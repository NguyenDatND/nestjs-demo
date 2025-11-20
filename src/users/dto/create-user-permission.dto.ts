import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateUserPermissionDto {
  @IsString()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionIds: string[];
}
