import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum Status {
    ACTIVE,
    DELETED
}

export type StructureMessage = {
    heading: string,
    body: string,
    status: Status
}

export type TemplateDocument = HydratedDocument<Template>

@Schema()
export class Template {
    @Prop({
        type: Object
    })
    ru: StructureMessage

    @Prop({
        type: Object
    })
    en: StructureMessage
}

export const TemplateSchema = SchemaFactory.createForClass(Template)