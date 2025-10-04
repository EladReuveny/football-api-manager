import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Position } from '../enums/position.enum';

export class CreatePlayerDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Age is required' })
  @Min(16, { message: 'Age must be at least 16' })
  age: number;

  @IsNotEmpty({ message: 'Position is required' })
  position: Position;

  @IsNotEmpty({ message: 'Rating is required' })
  @Min(55, { message: 'Rating must be at least 55' })
  @Max(100, { message: 'Rating cannot exceed 100' })
  rating: number;

  @IsNotEmpty({ message: 'Market value is required' })
  @IsPositive({ message: 'Market value must be a positive number' })
  marketValue: number;

  @IsNotEmpty({ message: 'Image URL is required' })
  @IsString({ message: 'Image URL must be a string' })
  imageUrl: string;

  @IsOptional({ message: 'Club ID is optional' })
  @IsPositive({ message: 'Club ID must be a positive number' })
  clubId?: number;

  @IsNotEmpty({ message: 'Nationality ID is required' })
  @IsPositive({ message: 'Nationality ID must be a positive number' })
  nationalityId: number;
}
