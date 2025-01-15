import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { CustomLoggerService } from "app/global/logger/logger.service";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramService {
    private bot: Telegraf
    constructor(
        private readonly logger: CustomLoggerService,
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka
    ) {
        this.bot = new Telegraf(process.env.TG_BOT_TOKEN)
    }

    /**
     * Sends a message to a specified Telegram chat.
     * 
     * @param chatId - The unique identifier for the target chat.
     * @param message - The message content to be sent.
     * 
     * Logs the successful message sending and emits a Kafka event.
     * If an error occurs, logs the error and emits a failure Kafka event.
     */
    async sendTelegram(chatId: string, message: string) {
        try {
            await this.bot.telegram.sendMessage(chatId, message);

            this.kafkaClient.emit('queuing.tg.sent', {chatId: chatId, message: message})
            this.logger.log(`Telegram message sent to: ${chatId}, message: ${message}`);
            
        } catch (error) {
            this.logger.error(`Error sending telegram message to: ${chatId}`, error.stack);
            this.kafkaClient.emit('queuing.tg.send.failed', error)
        }
    }
}