require("dotenv").config();
const { Client } = require("discord.js");
const client = new Client();
const getServerData = require("./utils/getServerData");
// Commands
const serverInfo = require("./utils/commands/serverInfo");

// Ip of your server
const serverHost = process.env.SERVER_HOST;
// Id of the server's game, you can find it here: https://www.npmjs.com/package/gamedig
const gameDigTypeID = process.env.GAMEDIG_TYPE_ID;
// Discord bot token
const discordBotToken = process.env.DISCORDJS_BOT_TOKEN;
// Channel where your bot should send messages
const channelName = process.env.CHANNEL;
// Bot will notify you when there are more players on the server than that number
const playerNumber = 2;

const connect = async () => {
  await client.login(discordBotToken);
  client.on("ready", () => {
    console.log(`${client.user.username} has logged in`);
  });
  let serverData = await getServerData(gameDigTypeID, serverHost);
  setInterval(() => {
    checkPlayers();
  }, 120 * 1000);
  if (!serverData) {
    return;
  }
  client.on("message", async (message) => {
    const prefix = "!";
    // Ignore echoed messages.
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith(prefix)) {
      const [commandName, ...args] = message.content
        .trim()
        .substring(prefix.length)
        .split(/\s+/);
      serverData = await getServerData(gameDigTypeID, serverHost);
      if (!serverData) {
        return;
      }
      switch (commandName.toLowerCase()) {
        case "serverinfo":
          serverInfo(message, serverData);
          break;
      }
    }
  });
};

const checkPlayers = async () => {
  const serverData = await getServerData(gameDigTypeID, serverHost);
  if (!serverData) {
    return;
  }
  if (serverData?.raw?.numplayers > playerNumber) {
    const channel = client.channels.cache.find(
      (channel) => channel.name === channelName
    );
    channel.send(
      `${serverData.name} has ${serverData.raw.numplayers} / ${serverData.maxplayers} players online now`
    );
  }
};

connect();
