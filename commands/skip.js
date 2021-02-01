module.exports = {
    id: "skip",
    aliases: [],
    channels: "guild",
    exec: (call) => {
        const serverQueue = call.client.queue.get(call.message.guild.id);

        if(!call.message.member.voice.channel)// check if user is in voice channel
            return call.message.channel.send("You need to join the voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        if(!serverQueue)
            return call.message.channel.send("There is nothing to skip!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        serverQueue.connection.dispatcher.end();
    }
}