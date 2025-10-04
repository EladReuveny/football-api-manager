import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const apiVersion = configService.get<string>('API_VERSION', 'api/v1');
  app.setGlobalPrefix(apiVersion);

  app.enableCors({
    origin: [configService.get<string>('CLIENT_URL')],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (configService.get<string>('NODE_ENV') !== 'production') {
    app.use(new LoggerMiddleware().use);
  }

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running at http://localhost:${configService.get<string>('SERVER_PORT', '3000')}/${apiVersion}`,
    );
  });
}
bootstrap();
