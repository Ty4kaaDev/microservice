import { IsNumber, IsString } from "class-validator";

export class UserIdDTO {
    @IsString()
    userId: string
}

export class UserRegisteredDTO {
    @IsString()
    user_email: string
}

export class UserCodeCheckDTO {
    @IsString()
    user_email: string

    @IsNumber()
    code: number
}