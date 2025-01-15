import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { TelegramService } from "./telergam.service";
import { ValidateData } from "app/global/validate/validate.decorator";
import { SendTelegramDTO } from "app/global/dto/tg.dto";

@Controller()
export class TelegramController {
    constructor(
        private readonly telegramService: TelegramService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) { }

    @MessagePattern('queuing.tg.send')
    async sendTelegram(
        @ValidateData({ type: SendTelegramDTO, topicForError: 'queuing.tg.send.failed' }) data: SendTelegramDTO
    ) {
        data.chatId.length > 0 ? data.chatId.forEach(async chatId => {
            await this.telegramService.sendTelegram(chatId, data.message)
        }) : null
    }
}