import { IsArray, IsString } from "class-validator";

export class SendTelegramDTO {
    @IsArray()
    chatId: Array<string>

    @IsString()
    message: string
}