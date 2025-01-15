import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { ResponseFuncStatus } from "app/global/dto/response/status.dto";
import { MessageDTO } from "app/global/dto/mail.dto";
import { CustomLoggerService } from "app/global/logger/logger.service";
import { Template } from "app/global/models/template.model";
import { Mode } from "fs";
import { Model } from "mongoose";
import { SentWebAppMessage } from "telegraf/typings/core/types/typegram";
import { fromReadableStream } from "telegraf/typings/input";

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly logger: CustomLoggerService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka,
        @InjectModel(Template.name) private readonly templateModel: Model<Template>

    ) { }

    /**
     * Sends an email to the specified recipient using the provided message.
     *
     * @param to - The recipient's email address.
     * @param message - The message content to be sent.
     *
     * Logs the successful email sending and emits a Kafka event.
     * If an error occurs, logs the error and emits a failure Kafka event.
     */
    async sendMail(to: string, message: MessageDTO) {
        const sendMessage = {
            to: to,
            subject: message.subject,
            text: message.text
        };

        try {
            this.logger.log(`Email sent to: ${to}, time: ${new Date().toISOString()}`);
            await this.mailerService.sendMail(sendMessage)
            this.kafkaClient.emit('queuing.email.sent', {
                to_address: to,
                heading: message.subject,
                body: message.text
            })
        } catch (error) {
            this.logger.error(`Email send error to: ${to}, time: ${new Date().toISOString()}`, error.stack);
            this.kafkaClient.emit('queuing.email.send.failed', error)
        }
    }

    async getTemplate(key: string, value: string): Promise<Template> {
        const template = await this.templateModel.findOne({ [key]: value }).exec();
        if (template) {
            return template
        }
        return
    }

    async getTemplates(key: string, value: string): Promise<Array<Template>> {
        const template = await this.templateModel.find({ [key]: value }).exec();
        if (template) {
            return template
        }
        return
    }

    async getMessageWithTemplate(template: Template, context: any, lang: string) {
        const templateModel = template[lang.toLowerCase()]
        if (!templateModel) return

        const renderTemplate = (template: string, data: any): string => {
            return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
                const keys = key.split('.');
                let value = data;
                try {
                    for (const k of keys) {
                        value = value[k];  // Доступ к вложенным данным
                    }
                    return value !== undefined ? value : `{{${key}}}`; // Если значение не найдено, оставить маркер
                } catch (error) {
                    return `{{${key}}}`; // Если ключ не найден, оставить маркер
                }
            });
        };
        
        const body = renderTemplate(templateModel.body, context);
        return { subject: templateModel.heading, text: body }
    }
}