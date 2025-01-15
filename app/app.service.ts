import { Inject, Injectable, Logger } from '@nestjs/common';
import { Status, StructureMessage, Template, TemplateDocument } from './global/models/template.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Handlebars from 'handlebars';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomLoggerService } from './global/logger/logger.service';
import { Telegraf } from 'telegraf';
import { ClientKafka } from '@nestjs/microservices';
import { EventMap, EventMapDocument } from './global/models/event_map.model';
import { MessageDTO, SendMailDTO } from './global/dto/mail.dto';
import { User } from './global/models/user.model';
@Injectable()
export class AppService {
    constructor(
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) {}

    /**
     * Send message to kafka topic
     * @param topic - topic to send message to
     * @param message - message to send
     */
    async sendToKafka(topic: string, message: any) {
        this.kafkaClient.emit(topic, message);
    }

}
