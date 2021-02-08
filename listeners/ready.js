const { Listener } = require('discord-akairo');
const config = require('../config.json');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        })
    }

    exec() {
        console.log(`I have logged in as ${this.client.user.username} (${this.client.user.id})`)
        if(config.user.updated === true){
            this.client.user.setUsername(config.user.name);
	        this.client.user.setAvatar(config.user.avatar);
            console.log("I have updated the username and avatar!")
        }
	    if(config.status.enabled){
		    if(config.status.type === "STREAMING"){
			    this.client.user.setActivity(config.status.text, {
				    type: config.status.type,
				    url: config.status.url
			    });
		    }else {
			    this.client.user.setActivity(config.status.text, {
				    type: config.status.type
			    });
		    }
	    }
    }
}

module.exports = ReadyListener;