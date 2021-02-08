const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        })
    }

    exec() {
        console.log(`I have logged in as ${this.client.user.username} (${this.client.user.id})`)
    }
}

module.exports = ReadyListener;