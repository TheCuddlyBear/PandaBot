const { Command } = require("discord-akairo");

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "general",
      description: "Pong",
    });
  }

  exec(message) {
    message.delete();
    return message.channel.send("Pong!").then((msg) => {
      msg.delete({ timeout: 10000 });
    });
  }
}

module.exports = PingCommand;
