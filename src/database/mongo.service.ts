import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IMongoService } from './mongo.service.interface';

@injectable()
export class MongoService implements IMongoService {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configservice: IConfigService
	) {}

	async connect(): Promise<void> {
		try {
			await mongoose.connect(this.configservice.getString('MONGO_URL'));
			this.loggerService.log('[MongoService] MongoDB connection is successfully');
		} catch (e) {
			e instanceof Error
				? this.loggerService.error('[MongoService] ' + e.message)
				: this.loggerService.error('[MongoService] ' + e);
		}
	}
	async disconnect(): Promise<void> {
		try {
			await mongoose.disconnect();
			this.loggerService.log('[MongoService] Successfully disconnected from MongoDB');
		} catch (e) {
			e instanceof Error
				? this.loggerService.error('[MongoService] ' + e.message)
				: this.loggerService.error('[MongoService] ' + e);
		}
	}
}
