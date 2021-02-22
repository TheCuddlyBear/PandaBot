
const { Command } = require("discord-akairo");

const Musixmatch = require("musixmatch");
const msx = Musixmatch({apikey: '473960e524a2f006dcb56db8b3bef87b'})

class LyricsCommand extends Command {
    constructor(){
        super('lyrics', {
            aliases: ['lyric', 'lyr'],
            category: "music",
            description: {
                content: "Plays the song you've given",
                usage: '[song]',
				examples: ['Blank space', 'Murder song']
            },
        })
    }

    exec(message){
        const vc = message.member.voice.channel
        const client = this.client

        if(!vc){
            message.channel.send("You have to be in a voice channel...").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }else {
            const serverQueue = client.queue.get(message.guild.id)

            if(!serverQueue){
                message.channel.send("There's nothing playing").then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }else {
                const songTitle = serverQueue.songs[0].title
                msx.trackSearch({q:songTitle})
                .then(function(data){
                    console.log(data);
                }).catch(function(err){
                    console.log(err);
            }
        }
    }
}