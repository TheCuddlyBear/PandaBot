module.exports = {
  id : "ping",
  aliases : [],
  channels : 'guild',
  exec : (call) => { call.message.channel.send("Pong!") }
}