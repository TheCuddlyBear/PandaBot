module.exports = {
  id : "ilse",
  aliases : [],
  channels : "guild",
  exec : (call) => {
    let memes =
        [ "is not funny...", "Pilsje", "= Ilsa", "drunk like a Pilsje" ];
    let reply = Math.floor(Math.random() * 4);

    call.message.channel.send(memes[reply]);
  }
}