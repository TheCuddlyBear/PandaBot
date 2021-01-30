module.exports = {
    name: "ilse",
    description: "ilse",
    execute(message, args){
      let memes = [ "is not funny...", "Pilsje", "= Ilsa", "drunk like a Pilsje" ];
      let reply = Math.floor(Math.random() * 4);
      
      
        message.channel.send(memes[reply]);
    }
}