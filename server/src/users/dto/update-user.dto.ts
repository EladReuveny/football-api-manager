import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional({ message: 'password is optional' })
  @IsString({ message: 'Password must be a string' })
  @Length(5, 50, { message: 'Password must be between 5 and 50 characters' })
  newPassword?: string;

  @IsOptional({ message: 'password is optional' })
  @IsString({ message: 'Password must be a string' })
  @Length(5, 50, { message: 'Password must be between 5 and 50 characters' })
  confirmPassword?: string;
}
