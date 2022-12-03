import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { BotController } from './controller/bot.controller';
import { IBotController } from './controller/bot.controller.interface';
import { MongoService } from './database/mongo.service';
import { IMongoService } from './database/mongo.service.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { CommandRepository } from './repositories/command.repository';
import { ICommandRepository } from './repositories/command.repository.interface';
import { MessageRepository } from './repositories/message.repository';
import { IMessageRepository } from './repositories/message.repository.interface';
import { MessageService } from './services/message.service';
import { IMessageService } from './services/message.service.interface';
import { TYPES } from './types';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
	bind<IMessageService>(TYPES.MessageService).to(MessageService);
	bind<IBotController>(TYPES.BotController).to(BotController);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IMongoService>(TYPES.MongoService).to(MongoService).inSingletonScope();
	bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository).inSingletonScope();
	bind<ICommandRepository>(TYPES.CommandRepository).to(CommandRepository).inSingletonScope();
});

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
