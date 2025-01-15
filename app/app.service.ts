import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { request } from 'express';

@Injectable()
export class AppService {
    constructor(
        @Inject(`${process.env.KAFKA_CLIENT_NAME}`) private readonly kafkaClient: ClientKafka,
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
