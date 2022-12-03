import { ICreateCommand } from '../models/command.create.interface';

export interface ICommandRepository {
	create: (command: ICreateCommand) => Promise<void>;
}
