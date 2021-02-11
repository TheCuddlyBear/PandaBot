const minecraftUtil = require('minecraft-server-util');
const Discord = require('discord.js');
const { Command } = require('discord-akairo')
const { version } = require('../package.json');

class MinecraftStatusCommand extends Command {
    constructor(){
        super('minecraftstatus', {
            aliases: ['mcstatus', 'mc'],
            category: 'minecraft',
			description: {
				content: 'Displays the server status of the Roses Minecraft Server',
			}
        });
    }

    async exec(message){
        minecraftUtil.status('play.takato.eu', { port: 25565}) // Get status
                .then((response) => {
                    const statusEmbed = new Discord.MessageEmbed() // Create embed with status
                        .setColor('#FF0033')
                        .setTitle('Roses Minecraft Status')
                        .setFooter(`Panda Jr. v${version}`)
                        .setThumbnail('https://minecraft-mp.com/images/favicon/277055.png')
                        .addFields(
                            { name: 'Server IP', value: 'play.takato.eu' },
                            { name: 'Server Version', value: response.version },
                            { name: 'Online players', value: response.onlinePlayers },
                            { name: 'Max player', value: response.maxPlayers }
                        )
                        .setTimestamp();
                    message.channel.send(statusEmbed); // send message
                    message.delete();
                })
                .catch((error) => { // catch errors
                    throw error;
                })
    }
}

module.exports = MinecraftStatusCommand;