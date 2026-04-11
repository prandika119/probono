import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // PENTING: Agar bisa diakses di semua module tanpa import ulang
      envFilePath: '.env', // Default-nya memang .env, tapi bagus untuk ekimport { ConfigModule } from '@nestjs/config';
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
