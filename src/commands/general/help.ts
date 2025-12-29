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

        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);
            if (command) {
                let helpText = `*Command:* ${command.name}\n`;
                if (command.aliases) helpText += `*Aliases:* ${command.aliases.join(', ')}\n`;
                if (command.description) helpText += `*Description:* ${command.description}\n`;
                if (command.usage) helpText += `*Usage:* ${config.prefix}${command.usage}\n`;

                await sock.sendMessage(remoteJid, { text: helpText });
                return;
            }
        }

        const categories = new Map<string, Command[]>();

        commands.forEach((cmd) => {
            const category = cmd.category || 'uncategorized';
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category)?.push(cmd);
        });

        let menuText = `*🤖 WhatsApp UserBot Menu*\n\n`;

        categories.forEach((cmds, category) => {
            menuText += `*${category.toUpperCase()}*\n`;
            cmds.forEach(cmd => {
                menuText += `• ${config.prefix}${cmd.name}${cmd.description ? ` - ${cmd.description}` : ''}\n`;
            });
            menuText += '\n';
        });

        menuText += `Type ${config.prefix}help <command> for more info.`;

        await sock.sendMessage(remoteJid, { text: menuText });
    }
};

export default help;
