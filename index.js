const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const config = require('./config.json');

class PandaClient extends AkairoClient {
	constructor() {
		super({
			ownerID: '206879635059900417'
		});

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: config.prefix
		})

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/'
		})

		this.listenerHandler = new ListenerHandler(this, {
			directory: './listeners/'
		})

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
	}
	
}

const client = new PandaClient();
client.login(config.token);