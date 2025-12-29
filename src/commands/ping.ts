import { Command } from '../types';

const ping: Command = {
    name: 'ping',
    description: 'Responds with Pong!',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (remoteJid) {
            await sock.sendMessage(remoteJid, { text: 'Pong!' });
        }
    }
};

export default ping;
