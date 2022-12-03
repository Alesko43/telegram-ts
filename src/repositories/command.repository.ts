import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ICreateCommand } from '../models/command.create.interface';
import { CommandModel } from '../models/command.model';
import { TYPES } from '../types';
import { ICommandRepository } from './command.repository.interface';

@injectable()
export class CommandRepository implements ICommandRepository {
	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {}

	public async create({ username, command_used }: ICreateCommand): Promise<void> {
		new CommandModel({ username, command_used }).save();
		this.saveInfo();
	}

	private saveInfo() {
		this.loggerService.log('[CommandRepository] Command is successfully saved to database.');
	}
}
