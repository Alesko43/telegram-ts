import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IBotController } from './controller/bot.controller.interface';
import TelegramBot from 'node-telegram-bot-api';
import { IConfigService } from './config/config.service.interface';
import { IMessageService } from './services/message.service.interface';
import { IMongoService } from './database/mongo.service.interface';

@injectable()
export class App {
	private readonly bot: TelegramBot;
	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.BotController) private botController: IBotController,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MessageService) private messageService: IMessageService,
		@inject(TYPES.MongoService) private mongoService: IMongoService
	) {
		this.bot = new TelegramBot(this.configService.getString('BOT_TOKEN'), { polling: true });
	}

	public showActiveCommands(): void {
		this.botController.activeCommands();
	}

	public setBotCommands(): void {
		this.botController.setCommands.call(this);
	}

	public getUserMessages(): void {
		this.botController.getMessages.call(this);
	}

	public async init(): Promise<void> {
		this.showActiveCommands();
		this.setBotCommands();
		this.getUserMessages();
		await this.mongoService.connect();
		this.loggerService.log('[Application] Telegram Bot Running!');
	}
}
