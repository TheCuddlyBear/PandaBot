const minecraftUtil = require('minecraft-server-util');
const Discord = require('discord.js')

module.exports = {
    id: "mcstats",
    aliases: ["mc"],
    channels: "any",
    exec: async (call) => {
        minecraftUtil.status('play.takato.eu', { port: 25565}) // Get status
                .then((response) => {
                    const statusEmbed = new Discord.MessageEmbed() // Create embed with status
                        .setColor('#ff007f')
                        .setTitle('Roses Minecraft Status')
                        .setThumbnail('https://minecraft-mp.com/images/favicon/277055.png')
                        .addFields(
                            { name: 'Server IP', value: 'play.takato.eu' },
                            { name: 'Server Version', value: response.version },
                            { name: 'Online players', value: response.onlinePlayers },
                            { name: 'Max player', value: response.maxPlayers }
                        )
                        .setTimestamp();
                    call.message.channel.send(statusEmbed); // send message
                })
                .catch((error) => { // catch errors
                    throw error;
                })
    }
}