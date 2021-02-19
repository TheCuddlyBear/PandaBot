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
        this.client.user.setActivity('Roses Discord Server', {
            type: 'WATCHING'
        })

        let statusArray = [{
            type: 'WATCHING',
            text: 'Roses Discord Server'
        }, {
            type: 'LISTENING',
            text: 'Yara singing in the rain'
        }, {
            type: 'PLAYING',
            text: '9 + 10 = 21'
        }, {
            type: 'COMPETING',
            text: 'If Usain Bolt can run up to 27.44mph, that means legally he is not allowed to run in a school zone...'
        }]

        this.client.setInterval(() => {
            let statusInt = Math.round(Math.random() * ((statusArray.length - 1) - 0) + 0);
            console.log(statusInt)

            this.client.user.setActivity(statusArray[statusInt].text, {
                type: statusArray[statusInt].type
            })
        }, 10000)
        
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