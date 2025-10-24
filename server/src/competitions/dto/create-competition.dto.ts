import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  MaxDate,
} from 'class-validator';
import { CompetitionType } from '../enums/competition-type.enum';

export class CreateCompetitionDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Logo URL is required' })
  @IsString({ message: 'Logo URL must be a string' })
  @IsUrl({}, { message: 'Logo URL must be a valid URL' })
  logoUrl: string;

  @IsOptional({ message: 'Established date is optional' })
  @IsDate({ message: 'Established date must be a valid date' })
  @MaxDate(new Date(), { message: 'Established date cannot be in the future' })
  @Type(() => Date)
  establishedAt?: Date;

  @IsNotEmpty({ message: 'Competition type is required' })
  competitionType: CompetitionType;

  @IsOptional({ message: 'Country ID is optional' })
  @IsPositive({ message: 'Country ID must be a positive number' })
  countryId?: number;

  @IsOptional({ message: 'Club IDs are optional' })
  @IsArray({ message: 'Club IDs must be an array' })
  clubsIds?: number[];
}
