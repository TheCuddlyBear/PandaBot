// Youtube
const { youtube_api } = require("../config.json");
const YoutubeAPI = require("discord-youtube-api");
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require("ytdl-core");

module.exports = {
  id: "playlist",
  aliases: ["pl"],
  channels: "guild",
  exec: async (call) => {
    const serverQueue = call.client.queue.get(call.message.guild.id);

    let vc = call.message.member.voice.channel;
    if (!vc) {
      call.message.delete();
      return call.message.channel
        .send("Please join a voice chat first")
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    } else {
      const playlistSearch = await searcher.getPlaylist(call.args.join(" ")); // Searches yt for the playlist
      const playlist = playlistSearch.sort(() => {
        // Shuffles the playlist into random order
        return 0.5 - Math.random();
      });

      sleep(6000); // Waits 6 seconds for searcher to finish inserting the playlist

      function sleep(delay) {
        // sleep function
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }

      if (!serverQueue) {
        const queueConstructor = {
          // constructor for the server queue
          textChannel: call.message.channel,
          voiceChannel: vc,
          connection: null,
          songs: [],
          volume: 0.1,
          playing: true,
        };
        call.client.queue.set(call.message.guild.id, queueConstructor);

        var i;
        for (i = 0; i < playlist.length; i++) {
          queueConstructor.songs.push(playlist[i]); // push the playlist songs into queue
        }

        call.message.channel
          .send("I have added all the songs from the playlist to the queue!")
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });

        try {
          // try the join voice channel of user
          let connection = await vc.join();
          queueConstructor.connection = connection;
          play(call.message.guild, queueConstructor.songs[0]);
          call.message.delete();
        } catch (err) {
          // catch error if there is one
          console.error(err);
          call.client.queue.delete(call.message.guild.id);
          return call.message.channel.send(
            `I wasn't able to join the voice chat ${err}`
          );
        }
      } else {
        // push playlist into queue if queue already exists
        var i;
        for (i = 0; i < playlist.length; i++) {
          serverQueue.songs.push(playlist[i]);
        }
        call.message.delete();
        return call.message.channel
          .send("I have added all the songs from the playlist to the queue!")
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });
      }
    }

    function play(guild, song) {
      const serverQueue = call.client.queue.get(guild.id);
      if (!song) {
        // If there are no songs left, leave voice channel
        serverQueue.voiceChannel.leave();
        call.client.queue.delete(guild.id);
        return;
      }
      console.log(`Now playing: ${song.title}`); // Announce what song is now playing to console
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { volume: serverQueue.volume })
        .on("finish", () => {
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        });
      serverQueue.textChannel
        .send(
          "I'm now playing: ```" +
            `${serverQueue.songs[0].title} || Duration: ${serverQueue.songs[0].duration.minutes}:${serverQueue.songs[0].duration.seconds}` +
            "```"
        )
        .then((msg) => {
          // announce to user what song is playing.
          msg.delete({ timeout: 10000 });
        });
    }
  },
};
