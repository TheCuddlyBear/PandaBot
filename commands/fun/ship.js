const { Command } = require('discord.js-commando');
const unirest = require('unirest');
const request = unirest("GET", "https://love-calculator.p.rapidapi.com/getPercentage");

module.exports = class ShipCommand extends Command {
    constructor(client){
        super(client, {
            name: 'ship',
            aliases: ['love'],
            group: 'fun',
            memberName: 'ship',
            description: 'Ships two people',
            args: [{
                key: 'firstName',
                prompt: 'What playlist would you like me to play?',
                type: 'string',
            },
                {
                    key: 'secondName',
                    prompt: 'What playlist would you like me to play?',
                    type: 'string',
                    default: 'player'
                },
            ],
            argsPromptLimit: 0
        })
    }

    run(message, { firstName, secondName }){
        request.query({
            "fname": firstName,
            "sname": secondName
        });

        request.headers({
            "x-rapidapi-key": "a3d17b1846msh21c54360d3182c0p157bfajsn73b0404a09e1",
            "x-rapidapi-host": "love-calculator.p.rapidapi.com",
            "useQueryString": true
        });

        request.end(function (res) {
            if (res.error) throw new Error(res.error);

            message.channel.send(`The love percentage of ${firstName} and ${secondName} is: ${res.body.percentage}%. ${res.body.result}`)
        });


    }
}