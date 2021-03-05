const { Listener } = require('discord-akairo');

const logger = require('../logger')

class CommandListener extends Listener {
    constructor(){
        super('command', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        })
    }

    exec(message, command, args){
        logger.info(`${message.member.user.username} has started command: ${command.id}`)
    }
}

module.exports = CommandListener;