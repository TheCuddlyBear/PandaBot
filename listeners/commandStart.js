const { Listener } = require('discord-akairo');

const logger = require('../logger')

class CommandStartListener extends Listener {
    constructor(){
        super('commandStart', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        })
    }

    exec(message, command, args){
        logger.info(`${message.member.user.username} has started command: ${command.id}`)
    }
}



module.exports = CommandStartListener;
