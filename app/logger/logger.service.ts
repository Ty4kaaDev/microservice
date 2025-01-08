import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
    private readonly logger = new Logger('CustomLogger');

    log(message: string) {
        this.logger.log(message);
    }

    error(message: string, error: string) {
        this.logger.error(message, error);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        if (process.env.DEBUG === 'YES') {
            this.logger.debug(message);
        }
    }
}
