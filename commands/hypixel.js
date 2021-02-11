const { Command } = require("discord-akairo");
const discord = require("discord.js");

// Require Hypixel Api wrapper
const { hypixel_api } = require("../config.json");
const Hypixel = require("hypixel-api-reborn");
const hypixel = new Hypixel.Client(hypixel_api);
const { version } = require("../package.json");

class HypixelCommand extends Command {
  constructor() {
    super("hypixel", {
      aliases: ["hypixel", "hp", "hyp"],
      category: "minecraft",
      description: {
        content: "Get's your hypixel stats from various games.",
        usage: "<player name> [game]",
        examples: [
          "TheCuddlyBear",
          "TheDevilsRoses bedwars",
          "MagixSpellz murdermystery",
        ],
      },
      args: [
        {
          id: "playername",
        },
        { id: "stattype", default: "player" },
      ],
    });
  }

  exec(message, { stattype, playername }) {
    if (stattype !== "player") {
      // checks which stats user wants
      switch (stattype) {
        case "skywars":
          getSkywarsStats(playername, message);
          message.delete();
          break;
        case "bedwars":
          getBedwarsStats(playername, message);
          message.delete();
          break;
        case "murdermystery":
          getMurderStats(playername, message);
          message.delete();
          break;
        case "buildbattle":
          getBuildStats(playername, message);
          message.delete();
          break;
        case "skyblock":
          message.channel.send(
            "You can view your skyblock stats here: https://sky.shiiyu.moe/stats/" +
              playername
          );
          message.delete();
          break;
        case "vampirez":
          getVampireStats(playername, message);
          message.delete();
          break;
        case "guild":
          getGuildStats(playername, message);
          message.delete();
          break;
      }
    } else {
      hypixel
        .getPlayer(playername)
        .then((player) => {
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " Hypixel stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              { name: "Rank", value: player.rank, inline: true },
              { name: "Karma", value: player.karma, inline: true },
              { name: "Level", value: player.level, inline: true },
              {
                name: "First login",
                value: player.firstLogin,
                inline: true,
              },
              {
                name: "Last login",
                value: player.lastLogin,
                inline: true,
              },
              {
                name: "Last played game",
                value: player.recentlyPlayedGame.toString(),
              }
            );
          message.channel.send(statEmbed);
          message.delete();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getSkywarsStats(player, message) {
      hypixel
        .getPlayer(player)
        .then((player) => {
          // requests api for the player object
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed() // creates embed message with stats
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " Skywars stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              {
                name: "Coins",
                value: player.stats.skywars.coins,
                inline: true,
              },
              {
                name: "Souls",
                value: player.stats.skywars.souls,
                inline: true,
              },
              {
                name: "Level",
                value: player.stats.skywars.level,
                inline: true,
              },
              {
                name: "Wins",
                value: player.stats.skywars.wins,
                inline: true,
              },
              {
                name: "Losses",
                value: player.stats.skywars.losses,
                inline: true,
              },
              {
                name: "Kills",
                value: player.stats.skywars.kills,
                inline: true,
              },
              {
                name: "K/D ration",
                value: player.stats.skywars.KDRatio,
                inline: true,
              }
            );
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getMurderStats(player, message) {
      hypixel
        .getPlayer(player)
        .then((player) => {
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " Murder Mystery stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              {
                name: "Coins",
                value: player.stats.murdermystery.coins,
                inline: true,
              },
              {
                name: "Murderer Wins",
                value: player.stats.murdermystery.winsAsMurderer,
                inline: true,
              },
              {
                name: "Detective Wins",
                value: player.stats.murdermystery.winsAsDetective,
                inline: true,
              },
              {
                name: "Wins",
                value: player.stats.murdermystery.wins,
                inline: true,
              },
              {
                name: "Kills",
                value: player.stats.murdermystery.kills,
                inline: true,
              },
              {
                name: "Deaths",
                value: player.stats.murdermystery.deaths,
                inline: true,
              },
              {
                name: "K/D ratio",
                value: player.stats.murdermystery.KDRatio,
                inline: true,
              }
            );
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getBedwarsStats(player, message) {
      hypixel
        .getPlayer(player)
        .then((player) => {
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " Bedwars stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              {
                name: "Coins",
                value: player.stats.bedwars.coins,
                inline: true,
              },
              {
                name: "Level",
                value: player.stats.bedwars.level,
                inline: true,
              },
              {
                name: "Wins",
                value: player.stats.bedwars.wins,
                inline: true,
              },
              {
                name: "Losses",
                value: player.stats.bedwars.losses,
                inline: true,
              },
              {
                name: "Deaths",
                value: player.stats.bedwars.deaths,
                inline: true,
              },
              {
                name: "Final Deaths",
                value: player.stats.bedwars.finalDeaths,
                inline: true,
              },
              {
                name: "Kills",
                value: player.stats.bedwars.kills,
                inline: true,
              },
              {
                name: "K/D ration",
                value: player.stats.skywars.KDRatio,
                inline: true,
              }
            );
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getBuildStats(player, message) {
      hypixel
        .getPlayer(player)
        .then((player) => {
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " Build Battle stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              {
                name: "Score",
                value: player.stats.buildbattle.score,
                inline: true,
              },
              {
                name: "Played Games",
                value: player.stats.buildbattle.playedGames,
                inline: true,
              },
              {
                name: "Coins",
                value: player.stats.buildbattle.coins,
                inline: true,
              },
              {
                name: "Total wins",
                value: player.stats.buildbattle.totalWins,
                inline: true,
              },
              {
                name: "Solo wins",
                value: player.stats.buildbattle.wins.solo,
                inline: true,
              },
              {
                name: "Team wins",
                value: player.stats.buildbattle.wins.team,
                inline: true,
              },
              {
                name: "Pro wins",
                value: player.stats.buildbattle.wins.pro,
                inline: true,
              },
              {
                name: "GTB Wins",
                value: player.stats.buildbattle.wins.gtb,
                inline: true,
              }
            );
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getVampireStats(player, message) {
      hypixel
        .getPlayer(player)
        .then((player) => {
          if (player.nickname.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(player.nickname + suffix + " VampireZ stats")
            .setThumbnail("https://minotar.net/avatar/" + player.nickname)
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields(
              {
                name: "Human",
                value: `Kills: ${player.stats.vampirez.human.kills} \n Deaths: ${player.stats.vampirez.human.deaths} \n K/D Ratio: ${player.stats.vampirez.human.KDRatio} \n Wins: ${player.stats.vampirez.human.wins}`,
                inline: true,
              },
              {
                name: "Vampire",
                value: `Kills: ${player.stats.vampirez.vampire.kills} \n Deaths: ${player.stats.vampirez.vampire.deaths} \n K/D Ratio: ${player.stats.vampirez.vampire.KDRatio}`,
                inline: true,
              },
              {
                name: "Zombie",
                value: `Kills: ${player.stats.vampirez.vampire.kills}`,
                inline: true,
              }
            );
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getGuildStats(guildArg, message) {
      hypixel
        .getGuild("name", guildArg)
        .then((guild) => {
          if (guild.name.endsWith("s")) {
            var suffix = "'";
          } else {
            var suffix = "'s";
          }

          const statEmbed = new discord.MessageEmbed()
            .setColor("#FF0033")
            .setTitle(guild.name + suffix + " stats")
            .setTimestamp()
            .setFooter(`Hypixel Stats • Panda Jr. v${version}`)
            .addFields({ name: "Level", value: guild.level, inline: true });
          message.channel.send(statEmbed);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
}

module.exports = HypixelCommand;
