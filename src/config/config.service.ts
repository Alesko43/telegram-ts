import { DotenvConfigOutput, config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.loggerService.error('[ConfigService] Env file is not found');
		} else {
			this.loggerService.log('[ConfigService] Env file is successfully readed');
			this.config = result.parsed!;
		}
	}
	getString(key: string): string {
		return this.config[key];
	}

	getNumber(key: string): number {
		return Number(this.config[key]);
	}
}
