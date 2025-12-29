import { Command } from '../types';

const alive: Command = {
    name: 'alive',
    description: 'Checks if the bot is running',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (remoteJid) {
            await sock.sendMessage(remoteJid, { text: 'I am online and ready!' });
        }
    },
};

export default alive;
