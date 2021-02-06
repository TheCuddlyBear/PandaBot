// HiveAPI
const hive = require('hive-api');

// Commando and discord
const Discord = require('discord.js');
const { Command } = require('discord.js-commando')

module.exports = class HiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hivemc',
            aliases: ['hive', 'hmc'],
            group: 'minecraft',
            memberName: 'hivemc',
            description: 'Gives your HiveMC stats',
            args: [{
                key: 'playername',
                prompt: 'What playlist would you like me to play?',
                type: 'string',
            }, ],
            argsPromptLimit: 0
        })
    }

    run(message, { playername }) {
        let player = new hive.Player(playername);

        player.info().then(info => {
            console.log(info)

            if (playername.endsWith('s')) {
                var suffix = "'"
            } else {
                var suffix = "'s"
            }

            const statEmbed = new Discord.MessageEmbed()
                .setColor('#FF0033')
                .setTitle(playername + suffix + " HiveMC stats")
                .setThumbnail('https://minotar.net/avatar/' + playername)
                .setTimestamp()
                .setFooter(`HiveMC Stats • Panda Jr. v${bot_version}`)
                .addFields({
                    name: 'Rank',
                    value: info.rank.humanName,
                    inline: true
                }, {
                    name: 'Tokens',
                    value: info.tokens,
                    inline: true
                }, {
                    name: 'Medals',
                    value: info.medals,
                    inline: true
                }, {
                    name: 'Credits',
                    value: info.credits,
                    inline: true
                }, {
                    name: 'First login',
                    value: info.firstLogin,
                    inline: true
                }, {
                    name: 'Last login',
                    value: info.lastLogin,
                    inline: true
                }, {
                    name: 'Last logout',
                    value: info.lastLogout
                })
            message.channel.send(statEmbed);
            message.delete();
        }).catch(e => {
            console.log(e)
        })
    }
}