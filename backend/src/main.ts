import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Khusus untuk artikel edukasi, cover image bisa diakses publik
  app.useStaticAssets(join(process.cwd(), 'uploads/educations'), {
    prefix: '/api/v1/uploads/educations/',
  });

  await app.listen(process.env.PORT ?? 3009);
  console.log(`Server is running on port ${process.env.PORT ?? 3009}`);
}
bootstrap();
