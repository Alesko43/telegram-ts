import TelegramBot from 'node-telegram-bot-api';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IMessageService } from './message.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import axios, { AxiosResponse } from 'axios';
import { IMessageRepository } from '../repositories/message.repository.interface';
import { ICreateMessage } from '../models/message.create.interface';
import { ICreateCommand } from '../models/command.create.interface';
import { ICommandRepository } from '../repositories/command.repository.interface';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class MessageService implements IMessageService {
	private _bot: TelegramBot;

	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.MessageRepository) private messageRepository: IMessageRepository,
		@inject(TYPES.CommandRepository) private commandRepository: ICommandRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {}

	get bot() {
		return this._bot;
	}
	async saveMessageLogInDB(messageDetail: ICreateMessage): Promise<void> {
		const { username, firstname, message } = messageDetail;
		this.messageRepository.create({ username, firstname, message });
	}

	async saveCommandLogInDB(commandDetail: ICreateCommand): Promise<void> {
		const { username, command_used } = commandDetail;
		this.commandRepository.create({ username, command_used });
	}

	async commandNotFoundMessage(id: number): Promise<void> {
		const message: string = 'Command is not found';

		await this.bot.sendMessage(id, message);
	}
	async parameterNotFoundMessage(id: number): Promise<void> {
		const message: string = 'Need parameter for usage this command. Example: /command params';

		await this.bot.sendMessage(id, message);
	}

	async helloMessage(id: number): Promise<void> {
		const message: string = 'AleskoBOT Started!';
		const stickerUrl: string =
			'https://cdn.tlgrm.app/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/256/9.webp';

		await this.bot.sendMessage(id, message);
		await this.bot.sendSticker(id, stickerUrl);
	}

	async testMessage(id: number): Promise<void> {
		const message: string = '/test commands worked';

		await this.bot.sendMessage(id, message);
	}

	async sendCryptoInfo(id: number): Promise<void> {
		const btcDataSource =
			'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/btc.min.json';
		const ethDataSource =
			'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eth.min.json';

		type Crypto = {
			btc?: { usd: string };
			eth?: { usd: string };
		};

		const getCryptoCurrencyPrice = (args: string[]): void => {
			args.forEach(async (crypto) => {
				await axios(crypto)
					.then((data) => data)
					.then((result: AxiosResponse<Crypto>) => {
						{
							this.bot.sendMessage(
								id,
								result.data.btc?.usd
									? `BTC: ${Number(result.data.btc?.usd).toFixed(2)}$`
									: `ETH: ${Number(result.data.eth?.usd).toFixed(2)}$`
							);
						}
					})
					.catch((e) =>
						e instanceof Error
							? this.loggerService.error('[BotMessageService]' + e.message)
							: this.loggerService.error('[BotMessageService]' + e)
					);
			});
		};
		getCryptoCurrencyPrice([btcDataSource, ethDataSource]);
	}

	async getWeather(id: number, city: string): Promise<void> {
		const weatherApiKey = this.configService.getString('WEATHER_API_KEY');
		const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

		try {
			const res: Promise<AxiosResponse> = axios(weatherApiUrl);
			const data: ResWeatherData = (await res).data;

			type ResWeatherData = {
				weather: [{ description: string; icon: string }];
				main: { temp: number; feels_like: number };
				name: string;
			};

			const {
				name,
				main: { temp, feels_like },
				weather: [{ description, icon }],
			} = data;

			const message = `CITY: ${name}\nWEATHER: ${description}\nTEMP: ${temp} °C  |  FEELSLIKE: ${feels_like} °C`;

			await this.bot.sendMessage(id, message);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(e.message);
			}
		}
	}
}
