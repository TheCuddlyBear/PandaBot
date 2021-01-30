const { DiscordAPIError, Channel } = require("discord.js")

module.exports = {
    name: "help",
    description: "Helps u",
    execute(message, args, Discord){
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Panda Jr. Help')
        message.channel.send(helpEmbed);
    }
}