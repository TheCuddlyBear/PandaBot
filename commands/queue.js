module.exports = {
  id : "queue",
  aliases : [ 'q' ],
  channels : "guild",
  exec : (call) => {
    const serverQueue = call.client.queue.get(call.message.guild.id);

    if (!call.message.member.voice.channel)
      return call.message.channel.send("You need to join the voice chat first")
          .then(msg => {msg.delete({timeout : 10000})})
      if (!serverQueue)
      return call.message.channel.send("I couldn't find any queued songs!")
          .then(msg => {msg.delete({timeout : 10000})})
      var i;
    var queueMsg
    for (i = 0; i < serverQueue.songs.length; i++) {
      var index

      if (index < 1) {
        index = 1;
      }
      else {
        index = i + 1;
      }
      queueMsg = queueMsg + index + ' - ' + serverQueue.songs[i].title + '\n';
    }

    call.message.channel.send('```' + queueMsg + '```')
        .then(msg => { msg.delete({timeout : 10000}); })
  }
}