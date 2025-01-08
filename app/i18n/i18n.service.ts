import { Injectable } from '@nestjs/common';
import * as i18n from 'i18n';
import { join } from 'path';

@Injectable()
export class I18nService {
  constructor() {
    i18n.configure({
      locales: ['en', 'ru'], // Поддерживаемые языки
      directory: join(__dirname, 'locales'), // Путь к папке с переводами
      defaultLocale: 'en', // Язык по умолчанию
      objectNotation: true, // Возможность вложенных объектов
    });
  }

  setLocale(locale: string) {
    i18n.setLocale(locale); // Устанавливаем текущий язык
  }

  getMessage(key: string, args?: any) {
    return i18n.__(key, args); // Получаем сообщение по ключу
  }
}