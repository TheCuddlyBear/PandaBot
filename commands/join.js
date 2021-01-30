const { execute } = require("./purge");

module.exports = {
    name: "join",
    description: "join voice channel",
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(voiceChannel){
            const connection = voiceChannel.join();
            message.channel.send('Alrighty, joining the voice channel now...');
            console.log('Joining voice channel: ' + message.member.voice.channel.id);
        }

        message.delete();
    }
}