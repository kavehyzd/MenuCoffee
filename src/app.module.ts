import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // برای استفاده از env
    ConfigModule.forRoot({
      isGlobal: true, // کل پروژه در دسترس باشه
    }),
    // اتصال به MongoDB با env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),

      }),
    }),

    CategoriesModule,
  ],
})
export class AppModule {}
