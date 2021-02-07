// Bot essentials
const { token, prefix, status } = require('./config.json');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
global.bot_version = "2.0.2";
 
let client = new CommandoClient({
    commandPrefix: prefix,
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
	if(status.type === "STREAMING"){
		client.user.setActivity(status.text, {
			type: status.type,
			url: status.url
		})
	}else {
		client.user.setActivity(status.text, {
			type: status.type
		})
	}
});
    
client.on('error', console.error);
 
client.login(token);