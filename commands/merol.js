const { Command } = require('discord-akairo');

// Youtube
const { youtube_api } = require('../config.json')
const YoutubeAPI = require('discord-youtube-api');
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require('ytdl-core');


class MerolCommand extends Command {
    constructor(){
        super('merol', {
            aliases: ['merol', 'mer'],
            category: "music",
            description: {
                content: "Plays the merol songs",
                usage: '[song]',
				examples: ['Blank space', 'Murder song']
            },
        })
    }

    async exec(message){
        const serverQueue = this.client.queue.get(message.guild.id);
        const client = this.client;

        let vc = message.member.voice.channel;

        if(!vc){
            message.delete();
            return message.channel.send("You have to join a voice channel before you can use this command!").then(msg => {
                msg.delete({ timeout: 10000 });
            })
        }else{
            const hjbebm = await searcher.searchVideos("hou je bek en bef me");
            const injoa = await searcher.searchVideos("https://www.youtube.com/watch?v=mm2jnH5f2Yw");
            const gr = await searcher.searchVideos("https://www.youtube.com/watch?v=2YRJJbPABYU");
            const jvv = await searcher.searchVideos("https://www.youtube.com/watch?v=vHKu0YxjYDU");
            const khegv = await searcher.searchVideos("https://www.youtube.com/watch?v=w56jT6yH-yg");
            const foefsafari = await searcher.searchVideos("https://www.youtube.com/watch?v=t3pcUIyKvfE");
            const lmdm = await searcher.searchVideos("https://www.youtube.com/watch?v=Xt9Zf0JIEQo");
            const kmdf = await searcher.searchVideos("https://www.youtube.com/watch?v=NPkpDKWlon0");

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

                queueConstructor.songs.push(hjbebm);
                queueConstructor.songs.push(injoa);
                queueConstructor.songs.push(gr);
                queueConstructor.songs.push(jvv);
                queueConstructor.songs.push(khegv);
                queueConstructor.songs.push(foefsafari);
                queueConstructor.songs.push(lmdm);
                queueConstructor.songs.push(kmdf);

                message.channel.send("Hou je bek en bef me!");

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
                const hjbebm = await searcher.searchVideos("hou je bek en bef me");
                const injoa = await searcher.searchVideos("https://www.youtube.com/watch?v=mm2jnH5f2Yw");
                const gr = await searcher.searchVideos("https://www.youtube.com/watch?v=2YRJJbPABYU");
                const jvv = await searcher.searchVideos("https://www.youtube.com/watch?v=vHKu0YxjYDU");
                const khegv = await searcher.searchVideos("https://www.youtube.com/watch?v=w56jT6yH-yg");
                const foefsafari = await searcher.searchVideos("https://www.youtube.com/watch?v=t3pcUIyKvfE");
                const lmdm = await searcher.searchVideos("https://www.youtube.com/watch?v=Xt9Zf0JIEQo");
                const kmdf = await searcher.searchVideos("https://www.youtube.com/watch?v=NPkpDKWlon0");


                serverQueue.songs.push(hjbebm);
                serverQueue.songs.push(injoa);
                serverQueue.songs.push(gr);
                serverQueue.songs.push(jvv);
                serverQueue.songs.push(khegv);
                serverQueue.songs.push(foefsafari);
                serverQueue.songs.push(lmdm);
                serverQueue.songs.push(kmdf);

                message.delete();
                return message.channel.send("Hou je bek en bef me!");
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

module.exports = MerolCommand;