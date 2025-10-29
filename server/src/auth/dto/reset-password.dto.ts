import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString({ message: 'New Password must be a string' })
  @Length(5, 50, {
    message: 'New Password must be between 5 and 50 characters',
  })
  newPassword: string;

  @IsString({ message: 'Confirm New Password must be a string' })
  @Length(5, 50, {
    message: 'Confirm New Password must be between 5 and 50 characters',
  })
  confirmPassword: string;
}
