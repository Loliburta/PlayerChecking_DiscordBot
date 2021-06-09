const Gamedig = require("gamedig");

module.exports = getServerData = async (gameDigTypeID, serverHost) => {
  try {
    const serverData = await Gamedig.query({
      type: gameDigTypeID,
      host: serverHost,
    });
    return serverData;
  } catch (err) {
    console.log("Server is offline");
    return null;
  }
};
