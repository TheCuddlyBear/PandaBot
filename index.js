// Bot essentials
const handler = require('d.js-command-handler');
const { token, prefix } = require('./config.json');
const Discord = require('discord.js');
 
let client = new Discord.Client({ disableEveryone: true });

// music queue
client.queue = new Discord.Collection();
 
<<<<<<< HEAD
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
=======
client.on('ready', () => {
    console.log(client.user.username + ' has successfully booted up.');
});
>>>>>>> 337ebe12e5e0a28a48b48040d0883db5797cab15
 
handler(__dirname + '/commands', client, { customPrefix: prefix });
 
client.login(token);