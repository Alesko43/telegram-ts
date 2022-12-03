import { IMessage } from './message.model';

export interface ICreateMessage {
	username: IMessage['username'];
	firstname: IMessage['firstname'];
	message: IMessage['message'];
}
