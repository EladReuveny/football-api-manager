import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Configuration for Swagger API documentation
 * @param version The version of the API
 * @returns A DocumentBuilder object with the Swagger configuration
 * @example const swaggerConfig = SwaggerConfig('1.0.0');
 */
export const SwaggerConfig = (version: string) => {
  return new DocumentBuilder()
    .setTitle('Football API Management System')
    .setDescription(
      'Comprehensive API documentation for the Football Management System',
    )
    .setVersion(version)
    .addTag('App', 'Application APIs')
    .addTag('Auth', 'Authentication and Authorization APIs')
    .addTag('Users', 'Club Management APIs')
    .addTag('Clubs', 'Club Management APIs')
    .addTag('Players', 'Player Management APIs')
    .addTag('Countries', 'Country Management APIs')
    .addTag('Competitions', 'Competition Management APIs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter JWT token as: Bearer {token}',
      },
      'jwtAccessToken',
    )
    .build();
};
