import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserService } from 'app/user/user.service';

@Module({
    imports: [],
    controllers: [EmailController],
    providers: [EmailService, UserService]
})

export class EmailModule {
    
}
