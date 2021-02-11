const { Command } = require('discord-akairo');

// Youtube
const { youtube_api } = require('../config.json')
const YoutubeAPI = require('discord-youtube-api');
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require('ytdl-core');


class PlayCommand extends Command {
    constructor(){
        super('play', {
            aliases: ['play', 'p'],
            category: "music",
            description: {
                content: "Plays the song you've given",
                usage: '[song]',
				examples: ['Blank space', 'Murder song']
            },
            args: [
                {
                    id: 'song',
                    match: 'text',
                }
            ]
        })
    }

    async exec(message, args){
        const serverQueue = this.client.queue.get(message.guild.id);
        const client = this.client;

        let vc = message.member.voice.channel;

        if(!vc){
            message.delete();
            return message.channel.send("You have to join a voice channel before you can use this command!").then(msg => {
                msg.delete({ timeout: 10000 });
            })
        }else{
            const songSearch = await searcher.searchVideos(args.song);

            if(!serverQueue){
                const queueConstructor = { // constructor for the server queue
                    textChannel: message.channel,
                    voiceChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 0.1,
                    playing: true
                };
                client.queue.set(message.guild.id, queueConstructor);

                queueConstructor.songs.push(songSearch);

                try{ // try to join voice channel of user
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){
                    console.error(err);
                    client.queue.delete(message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`)
                }
            }else {
                serverQueue.songs.push(songSearch);
                message.delete();
                return message.channel.send("I've added the song to the queue ```" + ` ${songSearch.title}` + "```").then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }
        }

        function play(guild, song){
            const serverQueue = client.queue.get(guild.id);
            if(!song){ // If there are no songs left, leave voice channel
                serverQueue.voiceChannel.leave();
                client.queue.delete(guild.id);
                return;
            }
            console.log(`Now playing: ${song.title}`); // Announce what song is now playing to console
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url), { volume: serverQueue.volume })
                .on('finish', () =>{
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                serverQueue.textChannel.send("I'm now playing: ```" + `${serverQueue.songs[0].title} || Duration: ${serverQueue.songs[0].duration.minutes}:${serverQueue.songs[0].duration.seconds}` + "```" ).then(msg => { // announce to user what song is playing.
                    msg.delete({ timeout: 10000 })
                })
        }

    }
}

module.exports = PlayCommand;