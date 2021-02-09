const { Command } = require("discord-akairo");

class StopCommand extends Command {
    constructor(){
        super('stop', {
            aliases: ['stop']
        })
    }

    exec(message){
        const serverQueue = this.client.queue.get(message.guild.id)

        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice channel first!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        if(!serverQueue)
            return message.channel.send("I am not playing anything right now...").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        message.channel.send("I will stop playing now, see you next time :wink:").then(msg => {
            msg.delete({ timeout: 10000 })
        })
        serverQueue.songs = []
        serverQueue.connection.dispatcher.end();
    }
}