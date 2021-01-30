const { Channel } = require('discord.js')

const giphy = require('giphy')('N107gTxStZFqu5KhUoVj5yO3ffHyjdyy')

module.exports = {
    name: "gif",
    description: 'Get a gif from giphy',
    execute(message, args){
        console.log( giphy.getMethods() )

        if(args.length == 0){
            message.channel.send("Please provide a search query!")
        }else{
            giphy.search(args)
        }
    }
}