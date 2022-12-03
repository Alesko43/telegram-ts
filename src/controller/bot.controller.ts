import { inject, injectable } from 'inversify';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { BotCommands, Commands } from '../commands/commands';
import { ILogger } from '../logger/logger.interface';
import { IMessageService } from '../services/message.service.interface';
import { TYPES } from '../types';
import { IBotController } from './bot.controller.interface';

@injectable()
export class BotController implements IBotController {
	private _bot: TelegramBot;

	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.MessageService) private messageService: IMessageService
	) {}

	get bot() {
		return this._bot;
	}

	public setCommands(): void {
		this.bot.setMyCommands(BotCommands);
	}

	public activeCommands(): void {
		const activeCommands: string[] = [];
		BotCommands.forEach((command) => activeCommands.push(command.command));
		this.loggerService.log('[BotController] Active Commands: ' + activeCommands);
	}

	public getMessages(): void {
		const [date, time] = [new Date().toLocaleDateString(), new Date().toLocaleTimeString()];

		this.bot.onText(new RegExp('.*'), async (msg: Message, source: RegExpExecArray | null) => {
			const {
				chat: { id, username, first_name },
				text,
			} = msg;

			if (source) {
				const sourceArray: string[] = source.input.split(' ');

				const usedCommandLog = () =>
					this.loggerService.log(
						`[BotController] Received command ('${sourceArray[0]}') from [${username}]: ` +
							date +
							'-' +
							time
					);
				const unusedCommandLog = () =>
					this.loggerService.log(
						`[BotController] Received unused command from [${username}]: ` +
							date +
							'-' +
							time
					);

				if (id && username && first_name && text) {
					if (source.input.startsWith('/')) {
						switch (text.split(' ')[0]) {
							case Commands.START:
								this.messageService.helloMessage.call(this, id);
								usedCommandLog();
								break;
							case Commands.TEST:
								this.messageService.testMessage.call(this, id);
								usedCommandLog();
								break;
							case Commands.CRYPTO:
								this.messageService.sendCryptoInfo.call(this, id);
								usedCommandLog();
								break;
							case Commands.WEATHER:
								if (sourceArray.length < 2) {
									this.messageService.parameterNotFoundMessage.call(this, id);
									unusedCommandLog();
									break;
								} else {
									const city = sourceArray[1];
									this.messageService.getWeather.call(this, id, city);
									usedCommandLog();
									break;
								}
							default:
								unusedCommandLog();
								return this.messageService.commandNotFoundMessage.call(this, id);
						}

						await this.messageService.saveCommandLogInDB({
							username,
							command_used: text.split(' ')[0],
						});
					} else {
						this.messageService.commandNotFoundMessage.call(this, id);
						this.loggerService.log(
							`[BotController] Received message from [${username}]: ` +
								date +
								'-' +
								time
						);
						await this.messageService.saveMessageLogInDB({
							username,
							firstname: first_name,
							message: text,
						});
					}
				}
			}
		});
	}
}
