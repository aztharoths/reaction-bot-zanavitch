const { Client, MessageReaction, User } = require("discord.js");
const firstMessage = require("./firstMessage");

const ROLE_CHANNEL_ID = "1015793373036150784";

const emojis = {
    wow_role_tank: "Tank",
    wow_role_heal: "Heal",
    wow_role_dps: "Dps",
    wow_target_triangle: "MM+",
    wow_target_times: "Pvp",
    wow_target_square: "Pve",
    wow_target_diamond: "Raid",
    logo_fortnite: "Fortnite",
    logo_wow: "Wow",
};

const emojisGame = {
    logo_fortnite: "Fortnite",
    logo_wow: "Wow",
};

const emojisStatus = {
    wow_target_triangle: "MM+",
    wow_target_times: "Pvp",
    wow_target_square: "Pve",
    wow_target_diamond: "Raid",
};

const emojisRole = {
    wow_role_tank: "Tank",
    wow_role_heal: "Heal",
    wow_role_dps: "Dps",
};

/**
 *
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Boolean} add
 */
const handlReaction = (reaction, user, add) => {
    const emojiName = reaction.emoji.name;
    const { guild } = reaction.message;

    const roleName = emojis[emojiName];

    if (!roleName) return;

    const role = guild.roles.cache.find((role) => role.name === roleName);

    if (!role) return;

    const member = guild.members.cache.find((member) => member.id === user.id);

    if (!member) return;

    if (add) {
        member.roles.add(role);
    } else {
        member.roles.remove(role);
    }
};

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
    const channel = client.channels.cache.find((channel) => channel.id === ROLE_CHANNEL_ID);

    const getEmoji = (emojiName) => {
        return client.emojis.cache.find((emoji) => emoji.name === emojiName);
    };

    const reactions = [];

    let text =
        "Salut ! Merci de nous aider à organiser le serveur : \n\n-Et toi, à quoi tu joues ? \n\n";

    for (const key in emojisGame) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        reactions.push(emoji);
        text += `${emoji} : ${emojis[key]} \n\n`;
    }

    text += "-Et toi, comment tu joues ? \n\n";

    for (const key in emojisStatus) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        reactions.push(emoji);
        text += `${emoji} : ${emojis[key]} \n\n`;
    }

    text += "-Et toi, qu'est-ce que tu joues ? \n\n";

    for (const key in emojisRole) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        reactions.push(emoji);
        text += `${emoji} : ${emojis[key]} \n\n`;
    }
    text +=
        "Réagis en fonctions de ce qui te parle pour récupérer les rôles correspondants ...\n\n";

    firstMessage(channel, text, reactions);

    client.on("messageReactionAdd", (reaction, user) => {
        if (reaction.message.channel.id === channel.id) {
            handlReaction(reaction, user, true);
        }
    });
    client.on("messageReactionRemove", (reaction, user) => {
        if (reaction.message.channel.id === channel.id) {
            handlReaction(reaction, user, false);
        }
    });
};
