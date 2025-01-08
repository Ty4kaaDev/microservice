import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomLoggerService } from '../logger/logger.service';
import { EventMap, EventMapSchema } from '../models/event_map.model';
import { Template, TemplateSchema } from '../models/template.model';
import { User, UserSchema } from '../models/user.schema';
@Global()
@Module({
    imports: [
        // mongoose 
        MongooseModule.forFeature([
            { name: EventMap.name, schema: EventMapSchema },
            { name: Template.name, schema: TemplateSchema },
            { name: User.name, schema: UserSchema}
        ]),
        // client kafka
        ClientsModule.register([
            {
                name: `${process.env.KAFKA_CLIENT_NAME}`,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_URI],
                    },
                    consumer: {
                        groupId: `${process.env.KAFKA_GROUP_ID}`
                    },
                },
            },
        ]),
        // smtp
        MailerModule.forRoot({
            transport: {
                host: process.env.MAILER_HOST,
                port: parseInt(process.env.MAILER_PORT),
                secure: process.env.MAILER_SECURE == "TRUE" ? true : false,
                tls: {
                    rejectUnauthorized: process.env.DEBUG == "YES" ? false : true
                }
            },
            defaults: {
                // "testname <testname@test.com>"
                from: `${process.env.MAILER_FROM_NAME} <${process.env.MAILER_FROM_NAME}@${process.env.DOMAIN}>`
            }

        })
    ],
    providers: [CustomLoggerService], // loger service 
    exports: [MongooseModule, ClientsModule, MailerModule, CustomLoggerService],
})
export class GlobalModule { }
