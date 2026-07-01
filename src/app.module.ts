import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import Joi from 'joi';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает переменные доступными во всем приложении без повторного импорта модуля

      // Настраиваем строгую валидацию через Joi
      validationSchema: Joi.object({
        // База данных ОБЯЗАТЕЛЬНА
        DATABASE_URL: Joi.string().required(),

        // Порт может быть не указан в .env, тогда по умолчанию будет 3000
        PORT: Joi.number().default(3000),

        // Секрет для токенов ОБЯЗАТЕЛЕН
        JWT_SECRET: Joi.string().required(),

        // Время жизни токенов. Если забудешь указать, Joi подставит значения по умолчанию
        TOKEN_EXPIRE: Joi.string().default('15m'),
        REFRESH_EXPIRE: Joi.string().default('7d'),
      }),
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
