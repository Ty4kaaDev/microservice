import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomLoggerService } from 'app/logger/logger.service';
import { EventMap, EventMapSchema } from 'app/models/event_map.model';
import { Template, TemplateSchema } from 'app/models/template.model';
import { User, UserSchema } from 'app/models/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EventMap.name, schema: EventMapSchema },
            { name: Template.name, schema: TemplateSchema },
            { name: User.name, schema: UserSchema}
        ]),
        ClientsModule.register([
            {
                name: `${process.env.KAFKA_CLIENT_NAME}`, // Имя клиента Kafkaprocess.env.KAFKA_CLIENT_NAME
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_URI], // Адрес брокера Kafka
                    },
                    consumer: {
                        groupId: `${process.env.KAFKA_GROUP_ID}`
                    },
                },
            },
        ]),
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
    providers: [CustomLoggerService],
    exports: [MongooseModule, ClientsModule, MailerModule, CustomLoggerService],
})
export class LazyModule { }
