// HiveAPI
const hive = require('hive-api');
const {version} = require('../package.json');
const Discord = require('discord.js');

const {Command} = require('discord-akairo');

class HiveCommand extends Command {
  constructor() {
    super('hive', {
      aliases : [ 'hivemc', 'hmc' ],
      category : 'minecraft',
      description : {
        content : "Get's your hive stats",
        usage : '<player name>',
        examples : [ 'TheCuddlyBear', 'TheDevilsRoses', 'MagixSpellz' ]
      },
      args : [ {
        id : 'playername',
      } ]
    })
  }

  exec(message, {playername}) {
    let player = new hive.Player(playername);

    player.info()
        .then(info => {
          if (playername.endsWith('s')) {
            var suffix = "'"
          } else {
            var suffix = "'s"
          }

          const statEmbed =
              new Discord.MessageEmbed()
                  .setColor('#FF0033')
                  .setTitle(playername + suffix + " HiveMC stats")
                  .setThumbnail('https://minotar.net/avatar/' + playername)
                  .setTimestamp()
                  .setFooter(`HiveMC Stats • Panda Jr. v${version}`)
                  .addFields(
                      {
                        name : 'Rank',
                        value : info.rank.humanName,
                        inline : true
                      },
                      {name : 'Tokens', value : info.tokens, inline : true},
                      {name : 'Medals', value : info.medals, inline : true},
                      {name : 'Credits', value : info.credits, inline : true}, {
                        name : 'First login',
                        value : info.firstLogin,
                        inline : true
                      },
                      {
                        name : 'Last login',
                        value : info.lastLogin,
                        inline : true
                      },
                      {name : 'Last logout', value : info.lastLogout})
          message.channel.send(statEmbed);
          message.delete();
        })
        .catch(e => {console.log(e)})
  }
}

module.exports = HiveCommand;