import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AppService } from "app/app.service";
import { I18nService } from "app/i18n/i18n.service";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

export const ValidateData = createParamDecorator(
    async (data: { data: any, topicForError?: string }, ctx: ExecutionContext): Promise<any> => {

        const message = ctx.switchToRpc().getData();

        const instance = plainToInstance(data.data, message)

        try {
            await validateOrReject(instance);
        } catch (errors) {
            const appService = ctx.switchToHttp().getRequest().appService as AppService
            const i18n = ctx.switchToHttp().getRequest().i18n as I18nService
            const errorMessage = errors.map(error => {
                return {
                    target: error.property,
                    message: error.constraints
                }
            })
            if (data.topicForError) {
                await appService.sendToKafka(data.topicForError, errorMessage)
            }
        }
    },
)
