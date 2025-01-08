import { Inject, Injectable, Logger } from '@nestjs/common';
import { Status, StructureMessage, Template, TemplateDocument } from './models/template.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Handlebars from 'handlebars';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomLoggerService } from './logger/logger.service';
import { Telegraf } from 'telegraf';
import { ClientKafka } from '@nestjs/microservices';
import { EventMap, EventMapDocument } from './models/event_map.model';
import { MessageDTO, SendMailDTO } from './dto/send-mail.dto';
import { User } from './models/user.schema';
@Injectable()
export class AppService {

    private bot: Telegraf
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<Template>,
        @InjectModel(EventMap.name) private readonly eventMapModel: Model<EventMap>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly mailerService: MailerService,
        private readonly logger: CustomLoggerService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) {
        this.bot = new Telegraf(process.env.TG_BOT_TOKEN)
    }

    /**
     * Render body of message by template and context
     * @param template - Template of message
     * @param context - Context of message
     * @returns Object with keys 'ru' and 'en' and values - rendered text of message
     */
    async renderBody(template: Template, context: any): Promise<Object> {
        const ruBody = Handlebars.compile(template.ru.body);
        const enBody = Handlebars.compile(template.en.body);
        return {
            ru: ruBody(context),
            en: enBody(context)
        }
    }

    /**
     * Create a new template with specified russian and english messages
     * @param ru - Russian message
     * @param en - English message
     * @returns Created template document
     */
    async createTemplate(ru: StructureMessage, en: StructureMessage,): Promise<TemplateDocument> {
        const template: Template = {
            ru: {
                heading: ru.heading,
                body: ru.body,
                status: ru.status
            },
            en: {
                heading: en.heading,
                body: en.body,
                status: ru.status
            }
        }

        const res = await this.templateModel.create(template);
        this.logger.log(`Template created: ${res._id}`);
        return res
    }
    /**
     * Send email to given address with given message
     * @param to - email address
     * @param message - object with subject and text of message
     */

    async sendMail(to: string, message: MessageDTO) {

        const sendMessage = {
            to: to,
            subject: message.subject,
            text: message.text
        };

        try {
            await this.mailerService.sendMail(sendMessage)
            this.sendToKafka('queuing.email.sent', sendMessage);

            this.logger.log(`Email sent to: ${to}, time: ${new Date().toISOString()}`);

        } catch (error) {
            this.sendToKafka('queuing.email.send.failed', error.stack);
            this.logger.error(`Email send error to: ${to}, time: ${new Date().toISOString()}`, error.stack);
        }
    }

    /**
     * Send message to kafka topic
     * @param topic - topic to send message to
     * @param message - message to send
     */
    async sendToKafka(topic: string, message: any) {
        this.kafkaClient.emit(topic, message);
    }

    /**
     * Send message to telegram
     * @param chatId - telegram chat id
     * @param message - message to send
     */
    async sendTelegram(chatId: string, message: string) {
        try {
            await this.bot.telegram.sendMessage(chatId, message);
            this.sendToKafka("queuing.email.sent ", { message });

            this.logger.log(`Telegram message sent to: ${chatId}, message: ${message}`);
        } catch (error) {
            this.sendToKafka("queuing.tg.send.failed", { message })

            this.logger.error(`Error sending telegram message to: ${chatId}`, error.stack);
        }
    }

    /**
     * Find event map by topic, render body of message by template and user context, and return SendMailDTO
     * @param topic - topic to find event map
     * @param userId - user id to find user
     * @returns SendMailDTO with rendered message
     */
    async informByTemplate(topic: string, userId: string): Promise<SendMailDTO> {
        const eventmap: EventMapDocument = await this.eventMapModel.findOne({
            topic: topic
        }).exec();

        if (eventmap) {
            await eventmap.populate('template_id')
            const user = await this.userModel.findById(userId)

            const body = this.renderBody(eventmap.template_id, user)

            return {
                to: user.email,
                message: {
                    subject: eventmap.template_id[user.lang].subject,
                    text: body[user.lang]
                }
            }
        }
    }

}
