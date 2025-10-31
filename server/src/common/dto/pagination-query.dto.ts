import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * Pagination query DTO
 *
 * Used to define query parameters for paginated endpoints.
 *
 * @example
 * ?page=2&limit=25
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'The current page number (default: 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'The number of items per page (default: 40)',
    example: 40,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  limit: number = 40;
}
