// Bot essentials
const { token, prefix } = require('./config.json');
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
 
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
		['moderation', 'Commands for moderating the server']
        ['music', 'Music commands'],
        ['minecraft', 'Minecraft commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
});
    
client.on('error', console.error);
 
client.login(token);