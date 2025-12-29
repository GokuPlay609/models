import { Command } from '../../types';
import { config } from '../../config';

const evalCmd: Command = {
    name: 'eval',
    aliases: ['>'],
    description: 'Executes arbitrary JavaScript code',
    category: 'owner',
    usage: 'eval <code>',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid) return;

        // Security check: Only owner should run this (even though it's a userbot, safe to be explicit)
        if (!msg.key.fromMe) return;

        const code = args.join(' ');
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const me = sock; // expose sock as 'me'
            let evaled = await eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await sock.sendMessage(remoteJid, { text: String(evaled) });
        } catch (err) {
            await sock.sendMessage(remoteJid, { text: `Error: ${err}` });
        }
    }
};

export default evalCmd;
