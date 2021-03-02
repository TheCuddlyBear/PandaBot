const { Command } = require('discord-akairo');

class ShipCommand extends Command {
    constructor(){
        super('ship', {
            aliases: ['ship'],
            category: 'fun',
            args: [{
                id: 'mention',
                type: 'memberMention',
                default: null
            }]
        })
    }

    exec(message, { mention }){
        var i;

        if(mention === null){
            message.channel.send("I cannot ship without a name!");
            return;
        }

        const argument = mention.displayName;
        const user = message.member.displayName;

        const loveTable = [
            [55, 55, 75, 55, 65, 55, 65, 50, 65],
            [55, 55, 75, 65, 55, 75, 55, 75, 55],
            [75, 65, 65, 50, 75, 75, 65, 50, 75],
            [55, 75, 50, 55, 50, 75, 75, 75, 50],
            [55, 50, 75, 50, 75, 50, 65, 50, 65],
            [50, 75, 75, 75, 50, 55, 55, 50, 75],
            [65, 55, 65, 75, 65, 55, 55, 50, 55],
            [50, 65, 55, 75, 55, 50, 55, 55, 50],
            [65, 55, 75, 50, 65, 75, 55, 50, 55]
          ];
        
          let Score = 0;
          let name1 = user;
          name1 = name1.toUpperCase();
          let name2 = argument;
          name2 = name2.toUpperCase();
        
          let ScoreFunction = function (name) {
            let NameArray = name.split('');
            for (i = 0; i < NameArray.length; i++) {
              if (NameArray[i].includes('A')) {
                Score += 1;
              } else if (NameArray[i].includes('E')) {
                Score += 5;
              } else if (NameArray[i].includes('I')) {
                Score += 9;
              } else if (NameArray[i].includes('O')) {
                Score += 6;
              } else if (NameArray[i].includes('U')) {
                Score += 3;
              }
            }
            return Score;
          }
        
        
        
          let Name1Score = ScoreFunction(name1);
          let Name2Score = ScoreFunction(name2);
        
          let SingleDigitSoulUrgeNumber = function (num) {
            let sum = 0;
            while (num > 0) {
              sum += parseInt(num % 10);
              num = parseInt(num / 10);
            }
            if (sum > 9) {
              sum = SingleDigitSoulUrgeNumber(sum);
            }
            return sum;
          }
        
          let Name1SoulUrgeNumber = SingleDigitSoulUrgeNumber(Name1Score);
          let Name2SoulUrgeNumber = SingleDigitSoulUrgeNumber(Name2Score);
        
          if (Name1SoulUrgeNumber > 0 & Name2SoulUrgeNumber > 0) {
        
            let index1 = Name1SoulUrgeNumber - 1;
            let index2 = Name2SoulUrgeNumber - 1;
        
            let lovePercent = loveTable[index1][index2];

            console.log(lovePercent)

          }
    }
}

module.exports = ShipCommand;