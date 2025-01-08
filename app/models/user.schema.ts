import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop({
        default: null
    })
    tgChatId: string | null

    @Prop()
    lang: string
}

export const UserSchema = SchemaFactory.createForClass(User)