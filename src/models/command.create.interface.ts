import { ICommand } from './command.model';

export interface ICreateCommand {
	username: ICommand['username'];
	command_used: ICommand['command_used'];
}
