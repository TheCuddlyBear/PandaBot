const { Listener } = require('discord-akairo');
const config = require('../config.json');

const logger = require('../logger')

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        })
    }

    exec() {
        logger.log({
            level: 'info',
            message: `I have logged in as ${this.client.user.username} (${this.client.user.id})`
        })
        
        this.client.user.setActivity('foefsafari', {
            type: 'LISTENING'
        })

        let statusArray = [{
            type: 'LISTENING',
            text: 'Yara singing in the rain'
        }, {
            type: 'PLAYING',
            text: '9 + 10 = 21'
        }, {
            type: 'WATCHING',
            text: 'Magix being sad'
        }, {
            type: 'LISTENING',
            text: 'Hou je bek en bef me'
        }, {
            type: 'LISTENING',
            text: 'foefsafari'
        }]

        this.client.setInterval(() => {
            let statusInt = Math.round(Math.random() * ((statusArray.length - 1) - 0) + 0);

            this.client.user.setActivity(statusArray[statusInt].text, {
                type: statusArray[statusInt].type
            })
        }, 20000)
        
        /* uncomment this code to use status in configuration
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
        */
    }
}

module.exports = ReadyListener;