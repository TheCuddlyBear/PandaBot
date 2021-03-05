const { Listener } = require('discord-akairo');

const logger = require('../logger')

class ErrorListener extends Listener{
    constructor() {
        super('error', {
            emitter: 'client',
            event: 'error'
        })
    }

    exec() {
        logger.error;
    }
}

module.exports = ErrorListener;