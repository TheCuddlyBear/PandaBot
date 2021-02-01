module.exports = {
    id: "stop",
    aliases: [],
    channels: "guild",
    exec: (call) => {
        const serverQueue = call.client.queue.get(call.message.guild.id)

        if(!call.message.member.voice.channel) // check if user is in voice channel
            return call.message.channel.send("You need to join the voice chat first!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        call.message.channel.send("I will stop playing now, see you next time :wink:").then(msg => {
            msg.delete({ timeout: 10000 })
        })    
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}