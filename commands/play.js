// Youtube
const { youtube_api } = require("../config.json");
const YoutubeAPI = require("discord-youtube-api");
const searcher = new YoutubeAPI(youtube_api);
const ytdl = require("ytdl-core");

module.exports = {
  id: "play",
  alias: ["start"],
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
      const song = await searcher.searchVideos(call.args.join(" "));

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

        queueConstructor.songs.push(song);

        try {
          // try to join voice channel of user
          let connection = await vc.join();
          queueConstructor.connection = connection;
          play(call.message.guild, queueConstructor.songs[0]);
          call.message.delete();
        } catch (err) {
          console.error(err);
          call.client.queue.delete(call.message.guild.id);
          return call.message.channel.send(
            `I wasn't able to join the voice chat ${err}`
          );
        }
      } else {
        serverQueue.songs.push(song);
        call.message.delete();
        return call.message.channel
          .send(
            "I've added the song to the queue ```" + ` ${song.title}` + "```"
          )
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
