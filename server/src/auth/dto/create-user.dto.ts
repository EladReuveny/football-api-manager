import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Length(5, 50, { message: 'Password must be between 5 and 50 characters' })
  password: string;

  @IsOptional({ message: 'Secret key is optional' })
  @IsString({ message: 'Secret key must be a string' })
  secretKey?: string;
}
