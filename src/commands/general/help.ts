import { Command } from '../../types';
import { commands } from '../../handlers/commandHandler';
import { config } from '../../config';

const help: Command = {
    name: 'help',
    aliases: ['menu', 'list'],
    description: 'Lists all available commands',
    category: 'general',
    usage: 'help [command_name]',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid) return;

        // React with robot emoji
        await sock.sendMessage(remoteJid, { react: { text: '🤖', key: msg.key } });

        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);
            if (command) {
                let helpText = `╭─── [ *${command.name.toUpperCase()}* ] ───╮\n`;
                if (command.description) helpText += `│ 📝 *Desc:* ${command.description}\n`;
                if (command.aliases) helpText += `│ 📎 *Aliases:* ${command.aliases.join(', ')}\n`;
                if (command.usage) helpText += `│ 💡 *Usage:* \`${config.prefix}${command.usage}\`\n`;
                if (command.category) helpText += `│ 📂 *Category:* ${command.category}\n`;
                helpText += `╰─────────────────────╯`;

                await sock.sendMessage(remoteJid, { text: helpText });
                return;
            }
        }

        const categories = new Map<string, Command[]>();

        commands.forEach((cmd) => {
            const category = cmd.category || 'Other';
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category)?.push(cmd);
        });

        let menuText = `╭─── [ *USERBOT MENU* ] ───╮\n│\n`;

        const sortedCategories = Array.from(categories.keys()).sort();

        sortedCategories.forEach((category) => {
            const cmds = categories.get(category)!;
            menuText += `│ *${category.toUpperCase()}* 📂\n`;
            cmds.forEach(cmd => {
                menuText += `│ • \`${config.prefix}${cmd.name}\`\n`;
            });
            menuText += `│\n`;
        });

        menuText += `│ Type \`${config.prefix}help <command>\` for details.\n`;
        menuText += `╰──────────────────────╯`;

        await sock.sendMessage(remoteJid, { text: menuText });
    }
};

export default help;
