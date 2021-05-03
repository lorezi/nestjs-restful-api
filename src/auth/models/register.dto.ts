import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Length(2, 15, { message: 'first_name must be at least 2 characters' })
  first_name: string;
  @IsNotEmpty()
  @Length(2, 15, { message: 'last_name must be at least 2 characters' })
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  password_confirm: string;
}
