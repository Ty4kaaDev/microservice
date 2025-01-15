import { Type } from "class-transformer";
import { IsArray, IsObject, IsString, ValidateNested } from "class-validator";

export class MessageDTO {
    @IsString()
    subject: string;

    @IsString()
    text: string
}

export class SendMailDTO {
    @IsArray()
    to_addresses: Array<string>;

    @IsArray()
    cc_addresses: Array<string>;

    @IsArray()
    bcc_addresses: Array<string>;

    @IsString()
    heading: string

    @IsString()
    body: string

}

