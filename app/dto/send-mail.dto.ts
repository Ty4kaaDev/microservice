import { Type } from "class-transformer";
import { IsObject, IsString, ValidateNested } from "class-validator";

export class MessageDTO {
    @IsString()
    subject: string;

    @IsString()
    text: string
}

export class SendMailDTO {
    @IsString()
    to: string;

    @IsObject()
    @ValidateNested()
    @Type(() => MessageDTO)
    message: MessageDTO
}

