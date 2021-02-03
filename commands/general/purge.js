const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
    constructor(client){
        super(client, {
            name: 'purge',
            aliases: ['bulkdel', 'bulkdelete', 'bulk'],
            group: 'music',
            memberName: 'purge',
            description: 'Removes the given amount of messages, if not older than two weeks.',
            args: [
                {
                    key: 'purgeArg',
                    prompt: 'What playlist would you like me to play?',
                    type: 'string',
                },
            ],
            argsPromptLimit: 0
        })
    }

    run(message, { purgeArg }){
        const amount = parseInt(purgeArg) + 1;

        if (isNaN(amount)){
            return message.reply('That doesn\'t seem to be a valid number.');

        }else if (amount <= 1 || amount > 100) {
            return message.reply('You need to put in a number between 1 and 99!');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error trying to purge the messages in this channel.')
        })
    }
}