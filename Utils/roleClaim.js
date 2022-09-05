const { Client, MessageReaction, User } = require("discord.js");
const firstMessage = require("./firstMessage");
const secondMessage = require("./secondMessage");

const ROLE_CHANNEL_ID = "1015793373036150784";
const RULES_CHANNEL_ID = "1015188283443134514";

const rulesEmoji = {
    nevini: "Aspirant",
};
const firstRole = "Touriste";

const emojis = {
    nevini: "Aspirant",
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
        if (emojiName === "nevini") {
            const roleToRemove = guild.roles.cache.find((role) => role.name === firstRole);
            member.roles.remove(roleToRemove);
        }
    } else {
        member.roles.remove(role);
        if (emojiName === "nevini") {
            const roleToAdd = guild.roles.cache.find((role) => role.name === firstRole);
            member.roles.add(roleToAdd);
        }
    }
};

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
    const rulesChannel = client.channels.cache.find((channel) => channel.id === RULES_CHANNEL_ID);
    const rolesChannel = client.channels.cache.find((channel) => channel.id === ROLE_CHANNEL_ID);

    const getEmoji = (emojiName) => {
        return client.emojis.cache.find((emoji) => emoji.name === emojiName);
    };

    const rulesReactions = [];

    let rulesText = "";

    for (const key in rulesEmoji) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        rulesReactions.push(emoji);
        rulesText += `${emoji} : Valider les règles pour accéder au choix des rôles`;
    }

    secondMessage(rulesChannel, rulesText, rulesReactions);

    client.on("messageReactionAdd", (reaction, user) => {
        if (reaction.message.channel.id === rulesChannel.id) {
            handlReaction(reaction, user, true);
        }
    });
    client.on("messageReactionRemove", (reaction, user) => {
        if (reaction.message.channel.id === rulesChannel.id) {
            handlReaction(reaction, user, false);
        }
    });

    const rolesReactions = [];

    let rolesText =
        "Salut ! Merci de nous aider à organiser le serveur : \n\n-Et toi, à quoi tu joues ? \n\n";

    for (const key in emojisGame) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        rolesReactions.push(emoji);
        rolesText += `${emoji} : ${emojis[key]} \n\n`;
    }

    rolesText += "-Et toi, comment tu joues ? \n\n";

    for (const key in emojisStatus) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        rolesReactions.push(emoji);
        rolesText += `${emoji} : ${emojis[key]} \n\n`;
    }

    rolesText += "-Et toi, qu'est-ce que tu joues ? \n\n";

    for (const key in emojisRole) {
        const emoji = getEmoji(key);
        if (!emoji) return;
        rolesReactions.push(emoji);
        rolesText += `${emoji} : ${emojis[key]} \n\n`;
    }
    rolesText +=
        "Réagis en fonctions de ce qui te parle pour récupérer les rôles correspondants ...\n\n";

    firstMessage(rolesChannel, rolesText, rolesReactions);

    client.on("messageReactionAdd", (reaction, user) => {
        if (reaction.message.channel.id === rolesChannel.id) {
            handlReaction(reaction, user, true);
        }
    });
    client.on("messageReactionRemove", (reaction, user) => {
        if (reaction.message.channel.id === rolesChannel.id) {
            handlReaction(reaction, user, false);
        }
    });
};
