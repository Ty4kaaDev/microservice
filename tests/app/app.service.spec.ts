import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../app/app.controller";
import { AppModule } from "../../app/app.module";
import { AppService } from "../../app/app.service";
import { Status, Template } from "../../app/global/models/template.model";
import { ClientKafka } from "@nestjs/microservices";
import { MailerService } from "@nestjs-modules/mailer";
import { Telegraf } from "telegraf";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { EventMap } from "../../app/global/models/event_map.model";
import { User, UserDocument } from "../../app/global/models/user.model";
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as Handlebars from 'handlebars';
import mongoose, { Schema } from "mongoose";
import { GlobalModule } from "../../app/global/global.module";
import { SendMailDTO } from "app/global/dto/mail.dto";


jest.mock('handlebars', () => ({
    compile: jest.fn(),
  }));
  
  describe('AppService', () => {
    let mongoServer: MongoMemoryServer;
    let appService: AppService;
    let templateModel;
    let eventMapModel;
    let userModel;
  
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

      templateModel = {
        create: jest.fn(),
      };

      eventMapModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        remove: jest.fn(),
        exec: jest.fn(),
      },

      eventMapModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          populate: jest.fn(),
          topic: 'test_topic',
          template_id: {
            ru: { heading: 'Привет', body: 'Привет, {{name}}!', status: Status.ACTIVE },
            en: { heading: 'Hello', body: 'Hello, {{name}}!', status: Status.ACTIVE },
          },
        }),
      });
    
      userModel = {
        findById: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
            MongooseModule.forRoot(mongoUri),
            GlobalModule
        ],
        providers: [
          AppService,
          {
            provide: getModelToken(Template.name),
            useValue: templateModel,
          },
          {
            provide: getModelToken(EventMap.name),
            useValue: eventMapModel,
          },
          {
            provide: getModelToken(User.name),
            useValue: userModel,
          },
          {
            provide: MailerService,
            useValue: {
              sendMail: jest.fn(),
            },
          },
          {
            provide: ClientKafka,
            useValue: {
              emit: jest.fn(),
            },
          },
          {
            provide: Telegraf,
            useValue: {
              telegram: {
                sendMessage: jest.fn(),
              },
            },
          },
        ],
      }).compile();
  
      appService = module.get<AppService>(AppService);
    });

    afterAll(async () => {
      await mongoose.connection.close();
      await mongoServer.stop();
    });
  
    describe('renderBody', () => {
      it('should render body correctly for ru and en', async () => {
        const template: Template = {
            ru: { body: '{{name}} привет', heading: 'Заголовок на русском', status: 0 },
            en: { body: '{{name}} hello', heading: 'Heading in English', status: 0 },
          };
        const context = { name: 'John' };
  
        // Мокируем Handlebars.compile
        (Handlebars.compile as jest.Mock)
          .mockReturnValueOnce((context) => context.name + ' привет')
          .mockReturnValueOnce((context) => context.name + ' hello');
  
        const result = await appService.renderBody(template, context);
  
        expect(result).toEqual({
          ru: 'John привет',
          en: 'John hello',
        });
        expect(Handlebars.compile).toHaveBeenCalledTimes(2);
      });
    });
  
    describe('createTemplate', () => {
      it('should create a template successfully', async () => {
        const ruMessage = { heading: 'Привет', body: 'Как дела?', status: Status.ACTIVE };
        const enMessage = { heading: 'Hello', body: 'How are you?', status: Status.ACTIVE };
  
        const newTemplate: Template = {
          ru: ruMessage,
          en: enMessage,
        };
  
        templateModel.create.mockResolvedValue(newTemplate);
  
        const result = await appService.createTemplate(ruMessage, enMessage);
  
        expect(templateModel.create).toHaveBeenCalledWith(newTemplate);
        expect(result).toEqual(newTemplate);
      });
    });
  
    describe('informByTemplate', () => {
      it('should return correct SendMailDTO with populated template and user context', async () => {
        const topic = 'test_topic';
        const userId = 'userId123';
        const template = {
          ru: { body: 'Привет, {{name}}!' },
          en: { body: 'Hello, {{name}}!' },
        };
        const user = { email: 'test@example.com', lang: 'ru', name: 'John' };
  
        eventMapModel.findOne.mockResolvedValue({
          topic,
          template_id: template,
        });
        userModel.findById.mockResolvedValue(user);
        Handlebars.compile(template.ru.body);
        Handlebars.compile(template.en.body);
  
        const result = await appService.informByTemplate(topic, userId);
  
        expect(result).toEqual({
          to: 'test@example.com',
          message: {
            subject: 'Привет, {{name}}!',
            text: 'Привет, John!',
          },
        });
      });
    });
  });

// describe(AppModule.name, () => {
//     let appController: AppController
//     let appService: AppService
//     let module: TestingModule

//     beforeEach(async () => {
//         module = await Test.createTestingModule({
//             imports: [AppModule],
//             controllers: [AppController],
//             providers: [AppService]
//         }).compile()

//         appController = module.get<AppController>(AppController)
//         appService = module.get<AppService>(AppService)
//     })


//     describe(AppService.name, () => {
//         describe("renderBody", () => {
//             it('rendering body message with template', async () => {
//                 const template: Template = {
//                     ru: {
//                         heading: "тест",
//                         body: "тест {{user.name}}",
//                         status: Status.ACTIVE
//                     },
//                     en: {
//                         heading: "test",
//                         body: "test {{user.name}}",
//                         status: Status.ACTIVE
//                     }
//                 }
//                 const context: any = {
//                     user: {
//                         name: "TestUserName"
//                     }
//                 }
                
//                 const result = await appService.renderBody(template, context)
//             })
//         })

//         describe("createTemplate", () => {

//         })

//         describe("sendMail", () => {

//         })

//         describe("sendToKafka", () => {

//         })

//         describe("sendTelegram", () => {

//         })

//         describe("informByTemplate", () => {

//         })
//     })

//     describe(AppController.name, () => {
//         describe("sendEmail", () => {

//         })

//         describe("sendTelegram", () => {

//         })

//         describe("informByTemplate", () => {

//         })
//     })
// })