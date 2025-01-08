import { IsString } from "class-validator";

export class SendTelegramDTO {
    @IsString()
    chatId: string

    @IsString()
    message: string
}