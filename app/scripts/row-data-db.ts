import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ScriptModule } from './scripts/script.module';
import { TemplateService } from './scripts/template.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ScriptModule);
    const importService = app.get(TemplateService);

    const filePath = 'src/scripts/files/uscities.csv';
    // await importService.importDataFromCsv(filePath);
    await importService.createdTemplates();
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Error during data import', err);
    process.exit(1);
});
