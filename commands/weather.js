const { Command } = require('discord-akairo');
const weather = require('weather-js');

class WeatherCommand extends Command {
    constructor(){
        super('weather', {
            aliases: ['weather', 'w'],
            category: 'utility',
            description: {
                content: "Get your weather",
                usage: '<location> [degree]',
                examples: ['New York City', 'Amsterdam C', 'Washington D.C. F']
            },
            args: [{
                id: 'location',
            }, {
                id: 'degree',
                default: 'C'
            }]
        })
    }

    exec(message, { location, degree }){
        weather.find({search: location, degreeType: degree}, function(err, result) {
            if(err) console.log(err);
           
            console.log(JSON.stringify(result, null, 2));
          });
    }
}

module.exports = WeatherCommand;