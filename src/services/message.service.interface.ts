import { ICreateCommand } from '../models/command.create.interface';
import { ICreateMessage } from '../models/message.create.interface';

export interface IMessageService {
	commandNotFoundMessage: (id: number) => Promise<void>;
	parameterNotFoundMessage: (id: number) => Promise<void>;
	helloMessage: (id: number) => Promise<void>;
	testMessage: (id: number) => Promise<void>;
	sendCryptoInfo: (id: number) => Promise<void>;
	saveMessageLogInDB: (messageDetail: ICreateMessage) => Promise<void>;
	saveCommandLogInDB: (commandDetail: ICreateCommand) => Promise<void>;
	getWeather: (id: number, city: string) => Promise<void>;
}
