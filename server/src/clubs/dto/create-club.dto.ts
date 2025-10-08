import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  MaxDate,
} from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty({ message: 'Club name is required' })
  @IsString({ message: 'Club name must be a string' })
  @Length(3, 100, { message: 'Club name must be between 3 and 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Logo URL is required' })
  @IsUrl({}, { message: 'Logo URL must be a valid URL' })
  logoUrl: string;

  @IsNotEmpty({ message: 'Country ID is required' })
  @IsPositive({ message: 'Country ID must be a positive number' })
  countryId: number;

  @IsOptional({ message: 'Established date is optional' })
  @IsDate({ message: 'Date must be valid' })
  @MaxDate(new Date(), { message: 'Date cannot be in the future' })
  establishedAt?: Date;
}
