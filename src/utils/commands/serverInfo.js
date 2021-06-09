module.exports = serverInfo = (message, serverData) => {
  message.channel.send(
    `${serverData.name} has ${serverData.raw.numplayers} / ${serverData.maxplayers} players online`
  );
};
