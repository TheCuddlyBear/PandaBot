// Bot essentials
const config = require('./config.json');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
global.bot_version = "2.0.2";
 
let client = new CommandoClient({
    commandPrefix: config.prefix,
    owner: "206879635059900417",
    invite: 'https://discord.gg/bRCvFy9',
})

// music queue
client.queue = new Discord.Collection();
 
//client registry
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['general', 'General commands'],
        ['music', 'Music commands'],
		['minecraft', 'Minecraft commands'],
		['fun', 'Fun commands'],
		['moderation', 'Mod commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setUsername(config.user.name);
	client.user.setAvatar(config.user.avatar)
	if(config.status.enabled){
		if(config.status.type === "STREAMING"){
			client.user.setActivity(config.status.text, {
				type: config.status.type,
				url: config.status.url
			});
		}else {
			client.user.setActivity(config.status.text, {
				type: config.status.type
			});
		}
	}
});
    
client.on('error', console.error);
 
client.login(config.token);