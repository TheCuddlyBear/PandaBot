const { Command } = require('discord-akairo');
const { version } = require('../package.json')

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'halp', 'h'],
			category: 'general',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'command',
					type: 'commandAlias',
					prompt: {
						start: 'Which command do you need help with?',
						retry: 'Please provide a valid command.',
						optional: true
					}
				}
			],
			description: {
				content: 'Displays a list of commands or information about a command.',
				usage: '[command]',
				examples: ['', 'star', 'remove-rep']
			}
		});
	}

	exec(message, { command }) {
        message.delete();
		if (!command) return this.execCommandList(message);

		const prefix = this.handler.prefix;
		const description = Object.assign({
			content: 'No description available.',
			usage: '',
			examples: [],
			fields: []
		}, command.description);

		const embed = this.client.util.embed()
			.setColor(0xFFAC33)
			.setTitle(`\`${prefix}${command.aliases[0]} ${description.usage}\``)
			.addField('Description', description.content);

		for (const field of description.fields) embed.addField(field.name, field.value);

		if (description.examples.length) {
			const text = `${prefix}${command.aliases[0]}`;
			embed.addField('Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true);
		}

		if (command.aliases.length > 1) {
			embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true);
		}

		return message.util.send({ embed });
	}

	async execCommandList(message) {
		const embed = this.client.util.embed()
			.setTitle("Panda Jr. **Help**")
			.setFooter(`Panda Jr. v${version}`)
			.setThumbnail('https://minecraft-mp.com/images/favicon/277055.png')
			.setColor('#FF0033')
			.addField('Command List',
				[
					'This is a list of commands.',
					'To view details for a command, do `!!help <command>`.'
				]);

		for (const category of this.handler.categories.values()) {
			const title = {
				general: '📝\u2000General',
				music: '🎵\u2000Music',
				utility: ':briefcase:\u2000Utility',
                minecraft: '🧱\u2000Minecraft'
			}[category.id];

			if (title) embed.addField(title, `\`${category.map(cmd => cmd.aliases[0]).join('` `')}\``, true);
		}

		const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');

		try {
			await message.author.send({ embed });
			if (shouldReply) return message.util.reply('I\'ve sent you a DM with the command list.').then(msg => {
                msg.delete({ timeout: 10000 })
            });
		} catch (err) {
			if (shouldReply) return message.util.reply('I could not send you the command list in DMs.').then(msg => {
                msg.delete({ timeout: 10000 })
            });
		}

		return undefined;
	}
}

module.exports = HelpCommand;