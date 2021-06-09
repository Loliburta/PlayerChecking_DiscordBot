require("dotenv").config();
const Gamedig = require("gamedig");
const { Client } = require("discord.js");
const client = new Client();
const serverHost = process.env.SERVER_HOST;
const discordBotToken = process.env.DISCORDJS_BOT_TOKEN;

const connect = async () => {
  await client.login(discordBotToken);
  client.on("ready", () => {
    console.log(`${client.user.username} has logged in`);
  });
  let serverData = await checkPlayers();
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
      console.log(commandName, args);

      if (commandName.toLowerCase() === "serverinfo") {
        serverData = await checkPlayers();
        if (!serverData) {
          return;
        }
        console.log(serverData.raw.numplayers);
        message.channel.send(
          `${serverData.name} has ${serverData.raw.numplayers} / ${serverData.maxplayers} players online`
        );
      }
    }
  });
};
const checkPlayers = async () => {
  try {
    const serverData = await Gamedig.query({
      type: "drakan",
      host: serverHost,
    });
    console.log(serverData);
    return serverData;
  } catch (err) {
    console.log("Server is offline");
    return null;
  }
};

connect();
