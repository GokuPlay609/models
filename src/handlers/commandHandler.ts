import { WASocket, WAMessage } from '@whiskeysockets/baileys';
import { Command } from '../types';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

export const commands: Map<string, Command> = new Map();

export const loadCommands = async () => {
    const commandsDir = path.join(__dirname, '../commands');
    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of files) {
        const commandModule = await import(path.join(commandsDir, file));
        const command: Command = commandModule.default;
        if (command && command.name) {
            commands.set(command.name, command);
            console.log(`Loaded command: ${command.name}`);
        }
    }
};

export const handleMessage = async (sock: WASocket, msg: WAMessage) => {
    const messageContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    if (!messageContent) return;

    if (!messageContent.startsWith(config.prefix)) return;

    const [commandName, ...args] = messageContent.slice(config.prefix.length).trim().split(/\s+/);

    if (!commandName) return;

    const command = commands.get(commandName);

    if (command) {
        try {
            await command.execute(sock, msg, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
        }
    }
};
