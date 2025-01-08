import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, Ctx, KafkaContext, MessagePattern } from '@nestjs/microservices';
import { ValidateData } from './validate/validate.decorator';
import { SendMailDTO } from './dto/send-mail.dto';
import { SendTelegramDTO } from './dto/send-tg.dto';
import { UserIdDTO } from './dto/user-id.dto';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) {
    }

    @MessagePattern('queuing.email.send')
    /**
     * Sends an email to the specified user.
     * @param data contains email data (to, message)
     * @returns {Promise<void>}
     */
    async sendEmail(
        @ValidateData({ data: SendMailDTO, topicForError: 'queuing.email.send.failed' }) data: SendMailDTO
    ) {
        await this.appService.sendMail(data.to, data.message)
    }

    @MessagePattern('queuing.tg.send')
    /**
     * Sends a telegram message to the specified chat id.
     * @param data contains telegram data (chatId, message)
     * @returns {Promise<void>}
     */
    async sendTelegram(
        @ValidateData({ data: SendTelegramDTO, topicForError: 'queuing.tg.send.failed' }) data: SendTelegramDTO
    ) {
        await this.appService.sendTelegram(data.chatId, data.message)
    }


    @MessagePattern()
    async informByTemplate(
        @Ctx() context: KafkaContext,
        @ValidateData({ data: UserIdDTO, topicForError: "queuing.email.send.failed" }) data: UserIdDTO
    ) {
        const topic = context.getTopic()
        const message = await this.appService.informByTemplate(topic, data.userId)

        this.kafkaClient.emit('queuing.email.send', message)
    }


}
