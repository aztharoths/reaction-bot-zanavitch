const { TextChannel, Message, Collection } = require("discord.js");

const timeout = 500; //in ms
/**
 *
 * @param {Message} message
 * @param {Array} reactions
 */
const addReactions = (message, reactions) => {
    message.react(reactions[0]);

    reactions.shift();

    if (reactions.length > 0) {
        setTimeout(() => {
            addReactions(message, reactions);
        }, timeout);
    }
};

const initSecondMessage = async (channel, text, reactions) => {
    await channel.send(text).then((message) => {
        addReactions(message, reactions);
    });
};

/**
 *
 * @param {Collection<String, Message>} messages
 * @param {String} text
 * @param {Array} reaction
 */
const editSecondMessage = (messages, text, reactions) => {
    for (const message of messages) {
        message[2].edit(text);
        if (reactions) {
            addReactions(message[1], reactions);
        }
    }
};

/**
 *
 * @param {TextChannel} channel
 * @param {String} text
 * @param {Array} reactions
 */
module.exports = (channel, text, reactions) => {
    channel.messages.fetch().then((messages) => {
        if (messages.size === 1) {
            initSecondMessage(channel, text, reactions);
        } else if (messages.size === 2) {
            editSecondMessage(messages, text, reactions);
        }
    });
};
