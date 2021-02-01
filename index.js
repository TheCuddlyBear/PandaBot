// Bot essentials
const handler = require('d.js-command-handler');
const {token, prefix} = require('./config.json');
const Discord = require('discord.js');

let client = new Discord.Client({disableEveryone : true});

// music queue
client.queue = new Discord.Collection();

client.on('ready', () => {
  console.log(client.user.username + ' has successfully booted up.');
});

handler(__dirname + '/commands', client, {customPrefix : prefix});

client.login(token);