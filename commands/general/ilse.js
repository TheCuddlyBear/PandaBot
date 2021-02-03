const { Command } = require('discord.js-commando')

module.exports = class IlseCommand extends Command {
    constructor(client){
        super(client, {
            name: 'ilse',
            aliases: [],
            group: 'general',
            memberName: 'ilse',
            description: 'Gives them ilse memes',
        })
    }

    run(message){
        let memes = [ "is not funny...", "Pilsje", "= Ilsa", "drunk like a Pilsje" ];
        let reply = Math.floor(Math.random() * 4);
        
        
        message.channel.send(memes[reply]);
    }
}