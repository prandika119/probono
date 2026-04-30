import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { CasesModule } from './cases/cases.module';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { EducationsModule } from './educations/educations.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // PENTING: Agar bisa diakses di semua module tanpa import ulang
      envFilePath: '.env',
    }),
    CategoriesModule,
    CasesModule,
    ChatsModule,
    EducationsModule,
    FilesModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
