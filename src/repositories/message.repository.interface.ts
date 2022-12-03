import { ICreateMessage } from '../models/message.create.interface';

export interface IMessageRepository {
	create: (message: ICreateMessage) => Promise<void>;
}
