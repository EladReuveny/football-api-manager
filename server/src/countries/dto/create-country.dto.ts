import { IsNotEmpty, IsUrl, Length } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'ISO code is required' })
  @Length(2, 3, { message: 'ISO code must be between 2 and 3 characters' })
  isoCode: string;

  @IsNotEmpty({ message: 'Flag URL is required' })
  @IsUrl({}, { message: 'Flag URL must be a valid URL' })
  flagUrl: string;
}
