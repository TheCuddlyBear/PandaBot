const {Command} = require('discord-akairo');

class PurgeCommand extends Command {
  constructor() {
    super('purge', {
      aliases : [ 'purge' ],
      category : 'utility',
      clientPermissions : [ 'MANAGE_MESSAGES' ],
      description : {
        content : 'Purges the given amount of messages',
        usage : '<number>',
        examples : [ '1', '10', '37' ]
      },
      args : [ {id : 'purgeArg', type : 'integer'} ]
    })
  }

  exec(message, {purgeArg}) {
    const amount = parseInt(purgeArg) + 1;

    if (isNaN(amount)) {
      return message.reply('That isn\'t a valid number.')
          .then(msg => { msg.delete({timeout : 10000}); });

    } else if (amount <= 1 || amount > 100) {
      return message.reply('The number needs to be between 1 and 99!')
          .then(msg => { msg.delete({timeout : 10000}); });
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send(
          'An error occured whilst trying to purge the messages in this channel.');
    })
  }
}

module.exports = PurgeCommand;