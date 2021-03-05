const { Listener } = require('discord-akairo');

const logger = require('../logger')

class CommandFinishListener extends Listener {
    constructor(){
        super('commandFinish', {
            emitter: 'commandHandler',
            event: "commandFinished"
        })
    }

    exec(message, command, args, returnValue){
        logger.info(`${message.member.user.username} has finished command: ${command.id}`)
    }
}

module.exports = CommandFinishListener;