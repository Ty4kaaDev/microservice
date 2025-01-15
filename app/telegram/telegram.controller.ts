import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { TelegramService } from "./telergam.service";
import { SendTelegramDTO } from "app/global/dto/tg.dto";

@Controller()
export class TelegramController {
    constructor(
        private readonly telegramService: TelegramService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) { }

    @MessagePattern('queuing.tg.send')
    async sendTelegram(
        @Payload() data: SendTelegramDTO
    ) {
        data.chatId.length > 0 ? data.chatId.forEach(async chatId => {
            await this.telegramService.sendTelegram(chatId, data.message)
        }) : null
    }
}