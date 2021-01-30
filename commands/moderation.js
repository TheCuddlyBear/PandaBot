module.exports = {
    name: "moderation",
    description: "moderation tools for server",
    execute(message, args){
        if(args[0] === "kick"){
            if(message.member.hasPermission("KICK_MEMBERS")){
                let taggedUser = message.mentions.members.first();
                if(taggedUser){
                    try{
                        taggedUser.kick("You have been kicked");
                        console.log("User " + taggedUser + " has been kicked")
                        message.channel.send("User " + taggedUser + " has been kicked from the server.").then(msg => {
                            msg.delete({ timeout: 10000 })
                        });
                    } catch(err) {
                        console.error(err);
                        message.reply("I do not have permissions to kick " + taggedUser).then(msg => {
                            msg.delete({ timeout: 10000 });
                        });
                    }
                }else{
                    message.reply("I could not find that user in the server list, sorry").then(msg => {
                        msg.delete({ timeout: 10000 });
                    });
                }


            }else {
                message.reply("I could not kick " + taggedUser + " because you do not have to required permissions.").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
            }
        }else if (args[0] === 'mute') {
            let muteRole = message.guild.roles.cache.find(x => x.name === "Muted");
            if(typeof muteRole === undefined){
                message.guild.roles.create({ data: { name: 'Muted', permissions: [] }});
                let taggedUser = message.mentions.members.first();
                taggedUser.addRole(muteRole);
            }else {
                let taggedUser = message.mentions.members.first();
                taggedUser.addRole(muteRole);
            }
        }else if (args[0] === 'ban'){
            if(member.hasPermission("BAN_MEMBERS")){
                let taggedUser = message.mentions.members.first();
                if(!taggedUser){
                    try{
                        taggedUser.ban("You have been banned");
                        console.log("User " + taggedUser + " has been banned")
                        message.channel.send("User " + taggedUser + " has been banned from the server.").then(msg => {
                            msg.delete({ timeout: 10000 })
                        });
                    }catch(err) {
                        console.error(err);
                        message.reply("I do not have permissions to ban " + taggedUser).then(msg => {
                            msg.delete({ timeout: 10000 });
                        });
                }
            }else{
                message.reply("I could not find that user in the server list, sorry").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
        }
    }else {
        message.reply("I could not kick " + taggedUser + " because you do not have to required permissions.").then(msg => {
            msg.delete({ timeout: 10000 });
        });
    }
        }
    }
}