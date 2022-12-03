export interface IMongoService {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
