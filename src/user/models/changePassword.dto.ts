import { IsNotEmpty } from 'class-validator';

export class ChangePassword {
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  password_confirm: string;
}
