const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const config = require('./config.json');
const Discord = require('discord.js')

// Logger
const logger = require('./logger')
let token;

if(config.dev){
	token = config.dev_token
}else{
	token = config.token
}

class PandaClient extends AkairoClient {
	constructor() {
		super({
			ownerID: '206879635059900417'
		});

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: config.prefix,
			commandUtil: true
		})

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/'
		})

		this.listenerHandler = new ListenerHandler(this, {
			directory: './listeners/'
		})

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler
		});

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
	}
	
}

const client = new PandaClient();

// music queue
client.queue = new Discord.Collection();

client.login(token);