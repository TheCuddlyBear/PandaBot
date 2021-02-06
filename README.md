# PandaBot

This bot has been created for the roses discord server! This means it has specific features towards the that server. Those features can be rewritten to be used by different servers, which I might do

### Features
Here are the current implemented features, features with an (&#42;) have been implemented to work on different servers.

* Music player (play, stop, skip, playlist)&#42;
* Hypixel statistics&#42;
* Minecraft server status
* HiveMC statistics&#42;
* Ship command&#42;
* Moderation commands (bulkdelete, etc)&#42;
* Ilse meme command

### Configuration
Here is an example config.json:

```json
{
    "prefix": "!!",
    "token": "<discord token>",
    "youtube_api": "<youtube data api>",
    "hypixel_api": "<hypixel api>",
    "mysqlhost": "<mysql host>",
    "mysqlport": "<mysql port>",
    "mysqluser": "<mysql username>",
    "mysqlpass": "<mysql password>",
    "mysqldb": "<mysql database>"
}
```

### Developing and running the bot

#### Dependencies
* [Node.js](https://nodejs.org/en/) v12

#### Clone repository and installing dependencies
```console
> git clone https://github.com/TheCuddlyBear/PandaBot.git
> cd PandaBot
> npm install
```

For music commands you need to install ffmpeg and opus

```console
> npm install ffmpeg-static
> npm install node-pre-gyp (only on MacOS and Linux)
> npm install @discordjs/opus
```

#### Setting up bot

Before you can start up the bot you need to create a **config.json** file

```console
> nano config.json
```

See the example configuration file at the top of the readme

#### Starting the bot

Starting the bot is as easy as running the following command:
```console
> npm start
```