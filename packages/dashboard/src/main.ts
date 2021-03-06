import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';

import {
  DASHBOARD_PORT,
  TransformInterceptor,
  ForbiddenExceptionFilter,
  AllExceptionsFilter,
} from '@ohbug-server/common';

import { LoggerConfig } from '@/shared/logger/logger.module';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(LoggerConfig),
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(cookieParser());

  app.setGlobalPrefix(`v1`);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(DASHBOARD_PORT);
  /* tslint:disable-next-line */
  console.log(`Dashboard is running on: ${await app.getUrl()}`);
}
bootstrap().catch((error) => {
  // tslint:disable-next-line:no-console
  console.error(error);
  process.exit(1);
});
