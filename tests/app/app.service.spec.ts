import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../app/app.controller";
import { AppModule } from "../../app/app.module";
import { AppService } from "../../app/app.service";

describe(AppModule.name, () => {
    let appController: AppController
    let appService: AppService
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [AppController],
            providers: [AppService]
        }).compile()

        appController = module.get<AppController>(AppController)
        appService = module.get<AppService>(AppService)
    })


    describe(AppService.name, () => {
        describe("renderBody", () => {

        })

        describe("createTemplate", () => {

        })

        describe("sendMail", () => {

        })

        describe("sendToKafka", () => {

        })

        describe("sendTelegram", () => {

        })

        describe("informByTemplate", () => {

        })
    })

    describe(AppController.name, () => {
        describe("sendEmail", () => {

        })

        describe("sendTelegram", () => {

        })

        describe("informByTemplate", () => {

        })
    })
})