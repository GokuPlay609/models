import { WAMessage, downloadMediaMessage, WASocket } from '@whiskeysockets/baileys';
import logger from './logger';

export const extractText = (msg: WAMessage): string => {
    return (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''
    );
};

export const downloadMedia = async (msg: WAMessage): Promise<Buffer | null> => {
    try {
        const type = Object.keys(msg.message || {})[0];
        if (type === 'imageMessage' || type === 'videoMessage' || type === 'stickerMessage') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: downloadMediaMessage types can be finicky
            const buffer = await downloadMediaMessage(msg, 'buffer', {});
            return buffer as Buffer;
        }
        return null;
    } catch (error) {
        logger.error({ err: error }, 'Error downloading media');
        return null;
    }
};

export const reply = async (sock: WASocket, msg: WAMessage, text: string) => {
    const remoteJid = msg.key.remoteJid;
    if (remoteJid) {
        await sock.sendMessage(remoteJid, { text }, { quoted: msg });
    }
};
