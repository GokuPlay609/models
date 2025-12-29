import { Command } from '../../types';
import { isJidGroup } from '@whiskeysockets/baileys';

const isAdmin = async (sock: any, jid: string, user: string): Promise<boolean> => {
    const groupMetadata = await sock.groupMetadata(jid);
    const participant = groupMetadata.participants.find((p: any) => p.id === user);
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
}

const promote: Command = {
    name: 'promote',
    description: 'Promotes a user to admin',
    category: 'group',
    usage: 'promote @user',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid || !isJidGroup(remoteJid)) {
             await sock.sendMessage(remoteJid!, { text: 'This command can only be used in groups.' });
             return;
        }

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            await sock.sendMessage(remoteJid, { text: 'Please mention a user to promote.' });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(remoteJid, mentioned, 'promote');
            await sock.sendMessage(remoteJid, { text: '✅ User promoted!' });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed to promote user. Ensure I am admin.' });
        }
    }
};

export default promote;
