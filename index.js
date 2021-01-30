/* 
This bot is created specifically for the Roses Discord Server
It can be rewritten to be used for other servers, e.g. music function
already has been rewritten.
*/

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

//Minecraft server settings
const minecraftUtil = require('minecraft-server-util');
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
    console.log(`I'm loggin in as user: ${client.user.tag} (${client.user.id})`); // notifies console that bot his logging in
    client.user.setActivity("Roses Discord Server", { // sets activity of bot to "Watching Roses Discord server"
        type: "WATCHING"
    })
     
});

client.login(token); // bot logs in
 
client.on('message', async(message) => { // runs when someone sends a message
    if (!message.content.startsWith(prefix) || message.author.bot) return; // Checks if message contains prefix set in config, else it will ignore message

    const serverQueue = musicQueue.get(message.guild.id); // Get music queue
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g) // Args variable
    const command = args.shift().toLowerCase(); // The actual command
    const longArgs = message.content.slice(prefix.length).trim(); // Argument with spaces.

    switch(command){ // Switch to see what command is run
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
        case 'mcstats':
            client.commands.get("mcstats").execute(message, args)
            break;
    }

    // Function to insert entire youtube playlist into the music queue
    async function playPlaylist(message, serverQueue){
        let vc = message.member.voice.channel
        if(!vc){ // If the user is not in a voice channel it will notify user.
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => { 
                msg.delete({ timeout: 10000 })
            })
        }else {
            const playlistSearch = await searcher.getPlaylist(args.join(" ")) // Searches yt for the playlist
            const playlist = playlistSearch.sort(() => { // Shuffles the playlist into random order
                return 0.5 - Math.random();
            })

            sleep(6000) // Waits 6 seconds for searcher to finish inserting the playlist

            function sleep(delay) { // sleep function
                var start = new Date().getTime();
                while (new Date().getTime() < start + delay);
            }

            if (!serverQueue){ // If the serverqueue does not exist, it will create one.
                const queueConstructor = { // constructor for the server queue
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
                    queueConstructor.songs.push(playlist[i]); // push the playlist songs into queue
                  }

                try{ // try the join voice channel of user
                    let connection = await vc.join(); 
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){ // catch error if there is one
                    console.error(err);
                    musicQueue.delete(message.guild.id);
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
    }

    // Function to get server status of Roses Minecraft Server
    async function getServerStatus(message){
            minecraftUtil.status('play.takato.eu', { port: 25565}) // Get status
                .then((response) => {
                    const statusEmbed = new Discord.MessageEmbed() // Create embed with status
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
                    console.log(response); // log the console
                    message.channel.send(statusEmbed); // send message
                })
                .catch((error) => { // catch errors
                    throw error;
                })
        }

    // Music play function
    async function executePlay(message, serverQueue){
        let vc = message.member.voice.channel;
        if(!vc){ // Check if user is in voice channel
            message.delete();
            return message.channel.send("Please join a voice chat first").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }else{
            const song = await searcher.searchVideos(args.join(" ")) // Search for song given by usere
 
            if(!serverQueue){ // If serverqueue doesn't exist, create onee
                const queueConstructor = { // Constructor to create server queue
                    textChannel: message.channel,
                    voiceChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 0.1,
                    playing: true
                };
                musicQueue.set(message.guild.id, queueConstructor); // add server queue to the bot wide musicqueue
 
                queueConstructor.songs.push(song); // push song into songs arraw
 
                try{ // try to join voice channel of user
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                    message.delete();
                }catch (err){
                    console.error(err);
                    musicQueue.delete(message.guild.id);
                    return message.channel.send(`I wasn't able to join the voice chat ${err}`)
                }
            }else{ // push song into array if queue already existed
                serverQueue.songs.push(song);
                message.delete();
                return message.channel.send("I've added the song to the queue ```" + ` ${song.title}` + "```").then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }
        }
    }

    // play function
    function play(guild, song){
        const serverQueue = musicQueue.get(guild.id);
        if(!song){ // If there are no songs left, leave voice channel
            serverQueue.voiceChannel.leave();
            musicQueue.delete(guild.id);
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

    // function to stop playing music
    function stop (message, serverQueue){ 
        if(!message.member.voice.channel) // check if user is in voice channel
            return message.channel.send("You need to join the voice chat first!").then(msg => {
                msg.delete({ timeout: 10000 })
            })
        message.channel.send("I will stop playing now, see you next time :wink:").then(msg => {
            msg.delete({ timeout: 10000 })
        })    
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end(); // end song playing
    }
    function skip (message, serverQueue){ // skip songs
        if(!message.member.voice.channel)// check if user is in voice channel
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
