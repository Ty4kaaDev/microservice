import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop()
    user_name: string

    @Prop()
    user_email: string

    @Prop({
        default: null
    })
    user_tg: string | null

    @Prop()
    user_lang: string
}

export const UserSchema = SchemaFactory.createForClass(User)