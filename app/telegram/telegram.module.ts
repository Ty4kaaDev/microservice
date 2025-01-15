import { Module } from '@nestjs/common';
import { TelegramService } from './telergam.service';
import { TelegramController } from './telegram.controller';

@Module({
    imports: [],
    controllers: [TelegramController],
    providers: [TelegramService]
})

export class TelegramModule {
    
}
