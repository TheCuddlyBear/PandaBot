module.exports = {
    id: "purge",
    aliases: [],
    channels: "guild",
    exec: (call) => {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)){
            return call.message.reply('That doesn\'t seem to be a valid number.');

        }else if (amount <= 1 || amount > 100) {
            return call.message.reply('You need to put in a number between 1 and 99!');
        }

        call.message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            call.message.channel.send('There was an error trying to purge the messages in this channel.')
        })
    }
}
