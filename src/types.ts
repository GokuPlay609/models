import { WASocket, WAMessage } from '@whiskeysockets/baileys';

export interface Command {
    name: string;
    aliases?: string[];
    description?: string;
    category?: string;
    usage?: string;
    execute: (sock: WASocket, msg: WAMessage, args: string[]) => Promise<void>;
}
