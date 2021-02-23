
const { Command } = require("discord-akairo");
const config = require('../config.json')
const { version } = require('../package.json');
const Discord = require('discord.js')

const Genius = require("genius-lyrics");
const Client = new Genius.Client(config.genius_token);
const musicInfo = require("music-info");

class LyricsCommand extends Command {
    constructor(){
        super('lyrics', {
            aliases: ['lyrics', 'lyr', 'l'],
            category: "music",
            description: {
                content: "Plays the song you've given"
            },
        })
    }

    async exec(message){
        const vc = message.member.voice.channel
        const client = this.client

        message.delete();

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
                musicInfo.searchSong({title: songTitle}).then(async (songSearch) => {
                    const searches = await Client.songs.search(songSearch.title);
                    const song = searches[0]
                    const lyrics = await song.lyrics();

                    const embed = new Discord.MessageEmbed()
                        .setColor('#6495ed')
                        .setTitle(`Lyrics for: ${song.title}`)
                        .setDescription(lyrics)
                        .setFooter(`Panda v${version}`)

                    message.reply(embed)
                });
            }
        }
    }
}

module.exports = LyricsCommand;