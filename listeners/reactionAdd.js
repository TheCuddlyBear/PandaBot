const { Listener } = require('discord-akairo');
const Discord = require('discord.js')
const config = require('../config.json');
const translate = require('@vitalets/google-translate-api');
const { version } = require('../package.json');

class ReactionListener extends Listener {
    constructor() {
        super('reaction', {
            emitter: 'client',
            event: 'messageReactionAdd'
        })
    }
    exec(messageReaction, user){
        const reaction = messageReaction;
    const message = reaction.message;
    const emoji = reaction.emoji

    switch(emoji.name){
        case '🇺🇸':
            translation(message, 'en');
            reaction.remove();
            break;
        case '🇳🇱':
            translation(message, 'nl')
            reaction.remove();
            break;
        case '🇫🇷':
            translation(message, 'fr')
            reaction.remove();
            break;
        case '🇪🇸':
            translation(message, 'es');
            reaction.remove();
            break;
        case '🇨🇳':
            translation(message, 'zh-CN');
            reaction.remove();
            break;
        case '🇯🇵':
            translation(message, 'ja');
            reaction.remove();
            break;
    }

    function translation(message, lang){
        translate(message.content, {to: lang}).then(res => {
            const embed = new Discord.MessageEmbed()
                .setColor('#6495ed')
                .setTitle('Translation')
                .setDescription(res.text)
            
                if(user.id === message.member.id){
                    embed.setFooter(`Panda Jr. v${version}`)
                }else{
                    embed.setFooter(`Requested by ${user.username}`)
                }

            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 120000 })
            })
        }).catch(err => {
            console.error(err)
        })
    }
    }
}

module.exports = ReactionListener;