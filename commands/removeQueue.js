const {Command} = require('discord-akairo');

class RemoveQueueCommand extends Command {
  constructor() { super('rmqueue', {aliases : [ 'rmqueue' ]}) }

  exec(message) { this.client.queue.delete(message.guild.id) }
}

module.exports = RemoveQueueCommand;