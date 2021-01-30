// Call filesystem, discord and config
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, youtube_api } = require('./config.json');

// Call youtube api and ytdl
const { YTSearcher } = require('ytsearcher');
const YoutubeAPI = require('discord-youtube-api');
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require('ytdl-core');
const { randomBytes } = require('crypto');
const { waitForDebugger } = require('inspector');
const musicQueue = new Map();

//Minecraft
const util = require('minecraft-server-util');
const settingsMap = new Map();



// Call discord client + commands
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('The bot has loaded.');
    client.user.setActivity("Roses Discord Server", {
        type: "WATCHING"
    })
     
});

client.login(token);
 
client.on('message', async(message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const serverQueue = musicQueue.get(message.guild.id);
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
    const longArgs = message.content.slice(prefix.length).trim();

    switch(command){
        case 'play':
            executePlay(message, serverQueue);
            break;
        case 'playlist':
            playPlaylist(message, serverQueue);
            break;
        case 'pause':
            pause(message, serverQueue);
            break;
        case 'resume':
            resume(message, serverQueue);
            break;
        case 'stop':
            stop(message, serverQueue);
            message.delete();
            break;
        case 'skip':
            skip(message, serverQueue);
            message.delete();
            break;
        case 'ping':
            client.commands.get('ping').execute(message, args);
            break;
        case 'purge':
            client.commands.get('purge').execute(message, args);
            break;
        case 'queue':
            queue(message, serverQueue)
            message.delete();
            break;
        case 'mod':
            client.commands.get('moderation').execute(message, args);
            message.delete();
            break;
        case 'help':
            client.commands.get('help').execute(message, args, Discord);
            message.delete();
            break;
        case 'ilse':
            client.commands.get("ilse").execute(message, args);
            break;
        case 'mcstatus':
            getServerStatus(message);
            break;
        case 'hypixel':
            client.commands.get("hypixel").execute(message, args, Discord);
            break;
        case 'gif':
            client.commands.get("gif").execute(message, longArgs)
            break;
        case 'spam':
            client.commands.get("spam").execute(message, args)
            break;
    }
    async function playPlaylist(message, serverQueue){
        let vc = message.member.voice.channel
        if(!vc){
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }else {
            const playlistSearch = await searcher.getPlaylist(args.join(" "))
            const playlist = playlistSearch.sort(() => {
                return 0.5 - Math.random();
            })

            sleep(6000)

            function sleep(delay) {
                var start = new Date().getTime();
                while (new Date().getTime() < start + delay);
            }

            if (!serverQueue){
                const queueConstructor = {
                    textChannel: message.channel,
                    voiceChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 0.1,
                    playing: true
                };
                musicQueue.set(message.guild.id, queueConstructor);

                var i
                for (i = 0; i < playlist.length; i++) {
                    queueConstructor.songs.push(playlist[i]);
                  }

                try{
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){
                    console.error(err);
                    musicQueue.delete(message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`)
                }
            }else{
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
    }

    async function getServerStatus(message){
            util.status('play.takato.eu', { port: 25565})
                .then((response) => {
                    const statusEmbed = new Discord.MessageEmbed()
                        .setColor('#ff007f')
                        .setTitle('Roses Minecraft Status')
                        .setThumbnail('https://minecraft-mp.com/images/favicon/277055.png')
                        .addFields(
                            { name: 'Server IP', value: 'play.takato.eu' },
                            { name: 'Server Version', value: response.version },
                            { name: 'Online players', value: response.onlinePlayers },
                            { name: 'Max player', value: response.maxPlayers }
                        )
                        .setTimestamp();
                    console.log(response);
                    message.channel.send(statusEmbed);
                })
                .catch((error) => {
                    throw error;
                })
        }

    async function executePlay(message, serverQueue){
        let vc = message.member.voice.channel;
        if(!vc){
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }else{
            const song = await searcher.searchVideos(args.join(" "))
 
            if(!serverQueue){
                const queueConstructor = {
                    textChannel: message.channel,
                    voiceChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 0.1,
                    playing: true
                };
                musicQueue.set(message.guild.id, queueConstructor);
 
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){
                    console.error(err);
                    musicQueue.delete(message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`)
                }
            }else{
                serverQueue.songs.push(song);
                message.delete();
                return message.channel.send("I've added the song to the queue ```" + ` ${song.title}` + "```").then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }
        }
    }
    function play(guild, song){
        const serverQueue = musicQueue.get(guild.id);
        if(!song){
            serverQueue.voiceChannel.leave();
            musicQueue.delete(guild.id);
            return;
        }
        console.log(`Now playing: ${song.title}`);
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url), { volume: serverQueue.volume })
            .on('finish', () =>{
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.textChannel.send("I'm now playing: ```" + `${serverQueue.songs[0].title} || Duration: ${serverQueue.songs[0].duration.minutes}:${serverQueue.songs[0].duration.seconds}` + "```" ).then(msg => {
                msg.delete({ timeout: 10000 })
            })
    }
    function stop (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        message.channel.send("I will stop playing now, see you next time :wink:").then(msg => {
            msg.delete({ timeout: 10000 })
        })    
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
    function skip (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        if(!serverQueue)
            return message.channel.send("There is nothing to skip!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        serverQueue.connection.dispatcher.end();
    }
    function queue (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        if(!serverQueue)
            return message.channel.send("I couldn't find any queued songs!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
            var i;
            var queueMsg
            for (i = 0; i < serverQueue.songs.length; i++) {
                var index
                
                if(isNaN(index)){
                    index = 1;
                }else {
                    index = i + 1;
                }
                queueMsg = queueMsg + index + ' - ' + serverQueue.songs[i].title + '\n';
            }

            message.channel.send('```' + queueMsg + '```').then(msg => {
                msg.delete({ timeout: 10000 });
            })
    }
    function pause(message, serverQueue){
        const dispatcher = serverQueue.connection

        dispatcher.pause();
        message.channel.send("I have paused the stream.")
    }
    function resume(message, serverQueue){
        const dispatcher = serverQueue.connection

        dispatcher.resume();
        message.channel.send("I have resumed the stream.")
    }
})
