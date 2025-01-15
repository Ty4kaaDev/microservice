import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Template } from "./template.model";

export enum Adresses {
    USER,
    ADMIN,
    QC
}

export enum MessageTypes {
    EMAIL,
    TG,
    WHATSAPP 
}

export type EventMapDocument = HydratedDocument<EventMap>

@Schema()
export class EventMap {
    @Prop({
        required: true
    })
    topic: string

    @Prop({
        ref: 'templates',
        required: true,
        index: true,
        type: Types.ObjectId
    })
    template_id: Template

    @Prop()
    to_address: Adresses

    @Prop()
    cc_address: Adresses

    @Prop()
    bcc_address: Adresses

    @Prop()
    message_type: MessageTypes
}

export const EventMapSchema = SchemaFactory.createForClass(EventMap)