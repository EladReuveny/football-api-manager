import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const serverPort = configService.get<string>('SERVER_PORT', '3000');
  const apiVersion = configService.get<string>('API_VERSION', 'api/v1');
  const version = apiVersion.split('/')[1] || 'v1';
  const nodeEnvironment = configService.get<string>('NODE_ENV');
  const clientUrl = [configService.get<string>('CLIENT_URL')];

  app.setGlobalPrefix(apiVersion);

  app.enableCors({
    origin: clientUrl,
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

  if (nodeEnvironment !== 'production') {
    app.use(new LoggerMiddleware().use);
  }

  app.useGlobalFilters(new GlobalExceptionFilter());

  const documentFactory = () =>
    SwaggerModule.createDocument(app, SwaggerConfig(version));
  SwaggerModule.setup(`/${apiVersion}/docs`, app, documentFactory, {
    jsonDocumentUrl: `/${apiVersion}/docs.json`,
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running at http://localhost:${serverPort}/${apiVersion}`,
    );
  });
}
bootstrap();
