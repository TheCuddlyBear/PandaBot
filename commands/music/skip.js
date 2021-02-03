const { Command } = require('discord.js-commando')

module.exports = class SkipCommand extends Command {
    constructor(client){
        super(client, {
            name: 'skip',
            aliases: ['st'],
            group: 'music',
            memberName: 'stop',
            description: 'Stops the current playing song',
        })
    }
}