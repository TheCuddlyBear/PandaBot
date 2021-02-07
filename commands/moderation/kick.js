const { Command } = require('discord.js-commando');

module.exports = class KickCommand extends Command {
    constructor(client){
        super(client, {
            name: 'kick',
            aliases: [],
            group: 'moderation',
            memberName: 'purge',
            description: 'Kicks the given player',
            args: [{
                key: 'member',
                prompt: 'What playlist would you like me to play?',
                type: 'member',
            }, ],
            argsPromptLimit: 0
        })
    }

    run(message){
        // execution code
    }
}