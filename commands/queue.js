const { Command } = require('discord-akairo');

class QueueCommand extends Command {
    constructor(){
        super('queue', {
            aliases: ['q'],
            category: 'music',
            description: {
                content: "Returns the current queue"
            }
        })
    }

    exec(message){
        const serverQueue = this.client.queue.get(message.guild.id);
        const client = this.client
        let messageA = "Current queue: \n ```"

        serverQueue.songs.forEach(song => {
            messageA = messageA + `${song.title + "\n"}`
        })

    }
}

module.exports = QueueCommand;