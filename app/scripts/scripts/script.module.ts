import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TemplateService } from "./template.service";
import { AppService } from "app/app.service";
import { LazyModule } from "app/lazy/lazy.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.DEBUG == 'YES' ?
            './env/debug.env' : './env/.env',
        }),
        MongooseModule.forRoot(process.env.MONGO_URI, {dbName: process.env.MONGO_NAME || 'test'}),
        LazyModule
    ],
    providers: [TemplateService, AppService]
})

export class ScriptModule { }