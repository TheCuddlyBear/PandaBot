const { Command } = require('discord-akairo');

class SkipCommand extends Command {
    constructor(){
        super('skip', {
            aliases: ['skip'],
            category: "music",
            description: "Skips the currently playing song."
        })
    }

    exec(message){
        const serverQueue = this.client.queue.get(message.guild.id);

        message.delete();

        if(!message.member.voice.channel)// check if user is in voice channel
            return message.channel.send("You need to join the voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        if(!serverQueue)
            return message.channel.send("There is nothing to skip!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        serverQueue.connection.dispatcher.end();
    }
}

module.exports = SkipCommand;