import { IsString, IsOptional, IsEmail } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
