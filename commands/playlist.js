const { Command } = require('discord-akairo');

// Youtube
const { youtube_api } = require('../config.json')
const YoutubeAPI = require('discord-youtube-api');
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require('ytdl-core-discord');


class PlaylistCommand extends Command {
    constructor() {
        super('playlist', {
            aliases: ['playlist', 'pl'],
            category: "music",
            description: {
                content: "Plays the song you've given",
                usage: '[playlist]',
				examples: ['Blank space', 'Murder song']
            },
            args: [
                {
                    id: 'arg',
                    match: 'text',
                }
            ]
        })
    }

    async exec(message, { arg }){
        const client = this.client;
        const serverQueue = client.queue.get(message.guild.id);

        let vc = message.member.voice.channel;
        if(!vc){
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => {
                msg.delete({ timeout: 10000 });
            })
        }else {
            const playlistSearch = await searcher.getPlaylist(arg);
            const playlist = playlistSearch.sort(() => {
                return 0.5 - Math.random();
            })

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

                const serverQueue = client.queue.get(message.guild.id);

                var i
                for (i = 0; i < playlist.length; i++) {
                    serverQueue.songs.push(playlist[i]); // push the playlist songs into queue
                  }

                  message.channel.send("I have added all the songs from the playlist to the queue!").then(msg => {
                    msg.delete({ timeout: 10000 })
                })

                try{
                    let connection = await vc.join();
                    serverQueue.connection = connection;
                    play(message.guild, serverQueue.songs[0]);
                    message.delete();
                }catch (err){
                    console.error(err);
                    client.queue.delete(message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`);
                }
            }else {
                var i
                for (i = 0; i < playlist.length; i++) {
                    serverQueue.songs.push(playlist[i]);
                }
                message.delete();
                return message.channel.send("I have added all the songs from the playlist to the queue!").then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }

            async function play(guild, song){
                const serverQueue = client.queue.get(guild.id);
                if(!song){ // If there are no songs left, leave voice channel
                    serverQueue.voiceChannel.leave();
                    client.queue.delete(guild.id);
                    return;
                }
                console.log(`Now playing: ${song.title}`); // Announce what song is now playing to console
                const dispatcher = serverQueue.connection
                    .play(await ytdl(song.url), { type: 'opus', volume: serverQueue.volume })
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
}

module.exports = PlaylistCommand;