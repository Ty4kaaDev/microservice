import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AppService } from "app/app.service";
import { CustomLoggerService } from "app/logger/logger.service";
import { Adresses, EventMap, MessageTypes } from "app/models/event_map.model";
import { Status, Template } from "app/models/template.model";
import { Model } from "mongoose";

@Injectable()
export class TemplateService {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<Template>,
        @InjectModel(EventMap.name) private readonly eventMapModel: Model<EventMap>,
    ) { }



    async createdTemplates() {

        const events = [
            {
                event: "course.finish",
                messages: [
                    {
                        lang: "ru",
                        heading: "Поздравляем с завершением курса!",
                        body: "<html><body>Привет, {{user.name}}!<br><br>Поздравляем тебя с успешным завершением очередного курса! Ты уже прошел <b>{{courses.amount}} курсов</b>, и это великолепный результат. Мы уверены, что полученные знания помогут тебе двигаться вперед и достигать новых вершин.<br><br>Желаем дальнейших успехов и стремительных побед на пути к новым знаниям!</body></html>"
                    },
                    {
                        lang: "en",
                        heading: "Congratulations on completing the course!",
                        body: "<html><body>Hello, {{user.name}}!<br><br>Congratulations on successfully completing another course! You've completed <b>{{courses.amount}} courses</b> so far, and that's an amazing achievement. We are sure the knowledge you've gained will help you move forward and reach new heights.<br><br>We wish you continued success and rapid progress in your learning journey!</body></html>"
                    }
                ]
            },

            {
                event: "course.cancel",
                messages: [
                    {
                        lang: "ru",
                        heading: "Курс не завершен",
                        body: "<html><body>Привет, {{user.name}}!<br><br>Жаль, что тебе не удалось завершить этот курс. Мы видим, что ты приложил много усилий, и надеемся, что ты не бросишь начатое. Тебе уже удалось пройти <b>{{courses.amount}} курсов</b>, и это достойный результат!<br><br>Мы уверены, что ты сможешь вернуться и завершить курс в будущем. Желаем тебе успехов и вдохновения на этом пути!</body></html>"
                    },
                    {
                        lang: "en",
                        heading: "Course not completed",
                        body: "<html><body>Hello, {{user.name}}!<br><br>We're sorry you couldn't finish this course. We see you've put in a lot of effort, and we hope you won't give up on what you've started. You've already completed <b>{{courses.amount}} courses</b>, and that's a great accomplishment!<br><br>We believe you'll be able to return and finish the course in the future. Wishing you success and inspiration along the way!</body></html>"
                    }
                ]
            },

            {
                event: "course.start",
                messages: [
                    {
                        lang: "ru",
                        heading: "Поздравляем с началом курса!",
                        body: "<html><body>Привет, {{user.name}}!<br><br>Поздравляем с началом нового курса! Ты только что начал новый этап обучения, и уже прошел <b>{{courses.amount}} курсов</b> до этого. Пусть этот курс откроет для тебя новые горизонты и поможет достичь новых целей.<br><br>Желаем тебе вдохновения и успешного старта! Ты на правильном пути!</body></html>"
                    },
                    {
                        lang: "en",
                        heading: "Congratulations on starting the course!",
                        body: "<html><body>Hello, {{user.name}}!<br><br>Congratulations on starting a new course! You've just embarked on a new phase of learning, and you've already completed <b>{{courses.amount}} courses</b> so far. May this course open new horizons for you and help you reach new goals.<br><br>We wish you inspiration and a successful start! You're on the right track!</body></html>"
                    }
                ]
            }
        ];


        for (const event of events) {
            // Создаем объект с сообщениями для каждого языка
            const messages = event.messages.reduce((acc, msg) => {
                acc[msg.lang] = { heading: msg.heading, body: msg.body };
                return acc;
            }, {});
        
            // Создаем новый шаблон, используя уже структурированные данные
            const template = await this.templateModel.create({
                ru: {
                    heading: messages['ru']?.heading,
                    body: messages['ru']?.body,
                    status: Status.ACTIVE
                },
                en: {
                    heading: messages['en']?.heading,
                    body: messages['en']?.body,
                    status: Status.ACTIVE
                },
            });

            const eventmap = await this.eventMapModel.create({
                topic: event.event,
                template_id: template._id,
                to_address: Adresses.USER,
                cc_address: Adresses.QC,
                bcc_address: Adresses.ADMIN,
                message_type: MessageTypes.EMAIL
            })

            console.log(eventmap)
        }
    }
}