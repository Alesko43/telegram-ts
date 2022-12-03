export interface IConfigService {
	getString: (key: string) => string;
	getNumber: (key: string) => number;
}
