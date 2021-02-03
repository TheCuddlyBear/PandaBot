// Youtube
const { youtube_api } = require('../../config.json')
const YoutubeAPI = require('discord-youtube-api');
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require('ytdl-core');

const { Command } = require('discord.js-commando')

module.exports = class PlaylistCommand extends Command {
    constructor(client){
        super(client, {
            name: 'playlist',
            aliases: ['pl'],
            group: 'music',
            memberName: 'playlist',
            description: 'Adds all the songs from the playlist to the queue',
            args: [
                {
                    key: 'playlistArg',
                    prompt: 'What playlist would you like me to play?',
                    type: 'string',
                },
            ],
            argsPromptLimit: 0
        })
    }

    async run(message, { playlistArg }){
        const client = this.client
        const serverQueue = client.queue.get(message.guild.id)

        let vc = message.member.voice.channel;
        if(!vc){
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }else{
            const playlistSearch = await searcher.getPlaylist(playlistArg) // Searches yt for the playlist
            const playlist = playlistSearch.sort(() => { // Shuffles the playlist into random order
                return 0.5 - Math.random();
            })

            sleep(6000) // Waits 6 seconds for searcher to finish inserting the playlist

            function sleep(delay) { // sleep function
                var start = new Date().getTime();
                while (new Date().getTime() < start + delay);
            }

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

                var i
                for (i = 0; i < playlist.length; i++) {
                    queueConstructor.songs.push(playlist[i]); // push the playlist songs into queue
                  }

                message.channel.send("I have added all the songs from the playlist to the queue!").then(msg => {
                    msg.delete({ timeout: 10000 })
                })

                try{ // try the join voice channel of user
                    let connection = await vc.join(); 
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){ // catch error if there is one
                    console.error(err);
                    client.queue.delete(call.message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`)
                }
            }else{ // push playlist into queue if queue already exists
                var i
                for (i = 0; i < playlist.length; i++) {
                    serverQueue.songs.push(playlist[i]);
                }
                message.delete();
                return message.channel.send("I have added all the songs from the playlist to the queue!").then(msg => {
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