import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [process.env.KAFKA_URI], // Подключаемся к Kafka на хосте
                },
            },
        },
    );
    const logger = new Logger('Microservice');
    try {
        logger.log('Microservice is starting...');
        logger.debug(`
            KAFKA_URI: ${process.env.KAFKA_URI}
            MONGO_URI: ${process.env.MONGO_URI}
            MONGO_NAME: ${process.env.MONGO_NAME}
            POSTGRE_URI: ${process.env.POSTGRE_URI}
            KAFKA_CLIENT_NAME: ${process.env.KAFKA_CLIENT_NAME}
            KAFKA_CLIENT_ID: ${process.env.KAFKA_CLIENT_ID}
            MAILER_HOST ${process.env.MAILER_HOST}
            MAILER_PORT ${process.env.MAILER_PORT}
            MAILER_SMTP ${process.env.MAILER_SMTP}
            MAILER_FROM_NAME ${process.env.MAILER_FROM_NAME}
            DOMAIN ${process.env.DOMAIN}`);
        await app.listen();
        logger.log('Microservice is listening...');
    } catch (error) {
        logger.error('Error starting microservice', error.stack);
    }
}
bootstrap();
