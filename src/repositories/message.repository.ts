import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ICreateMessage } from '../models/message.create.interface';
import { MessageModel } from '../models/message.model';
import { IMessageRepository } from './message.repository.interface';

@injectable()
export class MessageRepository implements IMessageRepository {
	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {}

	public async create({ username, firstname, message }: ICreateMessage): Promise<void> {
		new MessageModel({ username, firstname, message }).save();
		this.saveInfo();
	}

	private saveInfo() {
		this.loggerService.log('[MessageRepository] Message is successfully saved to database.');
	}
}
