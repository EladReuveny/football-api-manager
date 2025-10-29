import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}
