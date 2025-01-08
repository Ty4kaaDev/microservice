import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LazyModule } from './lazy/lazy.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.DEBUG == 'YES' ?
            './env/debug.env' : './env/.env',
        }),
        MongooseModule.forRoot(process.env.MONGO_URI, {dbName: process.env.MONGO_NAME || 'test'}),
        LazyModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}

