import { Command } from '../types';

const alive: Command = {
    name: 'alive',
    description: 'Checks if the bot is running',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid) return;

        const uptime = process.uptime();
        const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const platform = process.platform;
        const arch = process.arch;

        const text = `
╭─── [ *STATUS* ] ───╮
│
│ 🟢 *Status:* Online
│ ⏱️ *Uptime:* ${uptimeString}
│ 💾 *RAM:* ${ramUsage} MB
│ 💻 *Platform:* ${platform} (${arch})
│
╰──────────────────╯
        `.trim();

        await sock.sendMessage(remoteJid, { text });
    },
};

export default alive;
