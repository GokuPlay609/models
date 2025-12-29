import { WASocket, WAMessage } from '@whiskeysockets/baileys';
import { Command } from '../types';
import { config } from '../config';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

export const commands: Map<string, Command> = new Map();
export const aliases: Map<string, string> = new Map();

// Recursively search for command files
const getFiles = (dir: string): string[] => {
    const subdirs = fs.readdirSync(dir);
    const files: string[] = [];
    for (const subdir of subdirs) {
        const res = path.resolve(dir, subdir);
        if (fs.statSync(res).isDirectory()) {
            files.push(...getFiles(res));
        } else {
            files.push(res);
        }
    }
    return files;
};

export const loadCommands = async () => {
    const commandsDir = path.join(__dirname, '../commands');

    // Ensure directory exists
    if (!fs.existsSync(commandsDir)) {
        logger.warn('Commands directory not found, creating it...');
        fs.mkdirSync(commandsDir, { recursive: true });
        return;
    }

    const files = getFiles(commandsDir).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of files) {
        try {
            // Clear cache to allow hot reloading (if implemented later)
            delete require.cache[require.resolve(file)];

            const commandModule = await import(file);
            const command: Command = commandModule.default;

            if (command && command.name) {
                commands.set(command.name, command);
                if (command.aliases) {
                    command.aliases.forEach((alias) => aliases.set(alias, command.name));
                }
                logger.info(`Loaded command: ${command.name}`);
            }
        } catch (error) {
            logger.error({ err: error }, `Failed to load command from ${file}`);
        }
    }
};

export const handleMessage = async (sock: WASocket, msg: WAMessage) => {
    const messageContent =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption;

    if (!messageContent) return;

    if (!messageContent.startsWith(config.prefix)) return;

    const [commandName, ...args] = messageContent.slice(config.prefix.length).trim().split(/\s+/);

    if (!commandName) return;

    const finalCommandName = aliases.get(commandName) || commandName;
    const command = commands.get(finalCommandName);

    if (command) {
        try {
            await command.execute(sock, msg, args);
        } catch (error) {
            logger.error({ err: error }, `Error executing command ${finalCommandName}`);
            const remoteJid = msg.key.remoteJid;
            if (remoteJid) {
                await sock.sendMessage(remoteJid, {
                    text: `❌ Error executing command: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        }
    }
};
