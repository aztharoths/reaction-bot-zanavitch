const { Client, GatewayIntentBits } = require("discord.js");
const roleClaim = require("./Utils/roleClaim");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.once("ready", () => {
    console.log("I'm Ready !");
    roleClaim(client);
});

client.login(process.env.TOKEN);
