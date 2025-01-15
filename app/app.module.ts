import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalModule } from './global/global.module';
import { EmailModule } from './email/email.module';
import { TelegramModule } from './telegram/telegram.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
@Module({
    imports: [
        GlobalModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.DEBUG == 'YES' ?
            './env/debug.env' : './app/env/.env',
        }),
        MongooseModule.forRoot(process.env.MONGO_URI, {dbName: process.env.MONGO_NAME || 'test'}),
        EmailModule,
        TelegramModule,
        UserModule
    ],
    controllers: [],
    providers: [AppService],
})

export class AppModule {}

