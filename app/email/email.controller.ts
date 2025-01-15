import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, Ctx, KafkaContext, MessagePattern } from "@nestjs/microservices";
import { EmailService } from "./email.service";
import { ValidateData } from "app/global/validate/validate.decorator";
import { MessageDTO, SendMailDTO } from "app/global/dto/mail.dto";
import { Message } from "telegraf/typings/core/types/typegram";
import { UserService } from "app/user/user.service";
import { UserCodeCheckDTO, UserRegisteredDTO } from "app/global/dto/user.dto";

@Controller()
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
        private readonly userService: UserService
    ) { }

    @MessagePattern('queuing.email.send')
    async sendEmail(
        @ValidateData({ type: SendMailDTO, topicForError: 'queuing.email.send.failed' }) data: SendMailDTO
    ) {
        data.to_addresses.length > 0 ? data.to_addresses.forEach(async to => {
            await this.emailService.sendMail(to, { subject: data.heading, text: data.body })
        }) : null

        data.bcc_addresses.length > 0 ? data.bcc_addresses.forEach(async bcc => {
            await this.emailService.sendMail(bcc, { subject: data.heading, text: data.body })
        }) : null

        data.cc_addresses.length > 0 ? data.cc_addresses.forEach(async cc => {
            await this.emailService.sendMail(cc, { subject: data.heading, text: data.body })
        }) : null
    }

    @MessagePattern('queuing.password.code.checked')
    async passwordReset(
        @ValidateData({type: UserCodeCheckDTO, topicForError: 'queuing.email.send.failed'}) data: UserCodeCheckDTO,
        @Ctx() ctx: KafkaContext
    ){
        const template = await this.emailService.getTemplate('topic', ctx.getTopic())
        if(!template) {
            return
        }
        const user = await this.userService.getUser("user_email", data.user_email)
        const message: MessageDTO = await this.emailService.getMessageWithTemplate(template, user, user.user_lang)

        await this.emailService.sendMail(data.user_email, message)
    }

    @MessagePattern("queuing.user.registered")
    async userRegistered(
        @ValidateData({ type: UserRegisteredDTO, topicForError: "queuing.email.send.failed" }) data: UserRegisteredDTO,
        @Ctx() ctx: KafkaContext
    ) {
        const template = await this.emailService.getTemplate('topic', ctx.getTopic())
        if(!template) {
            return 
            // тут по идеи не нужна обработки ошибки
            // return чтобы не крашило если вдруг в базе не будет тесмлейта
        }
        const user = await this.userService.getUser("user_email", data.user_email)
        const message: MessageDTO = await this.emailService.getMessageWithTemplate(template, user, user.user_lang)
        if(!message) {
            return
        }
        
        await this.emailService.sendMail(data.user_email, message)
    }
}