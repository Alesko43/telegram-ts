import { IbotCommands } from './commands.interface';

export const BotCommands: IbotCommands[] = [
	{ command: '/start', description: 'Starting bot action' },
	{ command: '/test', description: 'Test Command' },
	{ command: '/crypto', description: 'Get the BTC and ETH currecy' },
	{ command: '/weather', description: 'Get weather data ( /weather <city> )' },
];

export enum Commands {
	START = '/start',
	TEST = '/test',
	CRYPTO = '/crypto',
	WEATHER = '/weather',
}
