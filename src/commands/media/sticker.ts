import { Command } from '../../types';
import { downloadMedia } from '../../utils/messageUtils';
import logger from '../../utils/logger';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const sticker: Command = {
    name: 'sticker',
    aliases: ['s', 'stiker'],
    description: 'Converts image/video to sticker',
    category: 'media',
    usage: 'sticker (reply to media)',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid) return;

        // Check if FFmpeg is installed
        try {
            await execPromise('ffmpeg -version');
        } catch (e) {
             await sock.sendMessage(remoteJid, { text: '⚠️ FFmpeg is not installed on this server. Sticker conversion cannot proceed.' });
             return;
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const targetMessage = quoted ? { message: quoted } : msg;

        // Construct a WAMessage-like object for downloadMedia
        const messageToDownload: any = {
             key: msg.key,
             message: targetMessage.message
        };


        const buffer = await downloadMedia(messageToDownload);

        if (!buffer) {
            await sock.sendMessage(remoteJid, { text: '❌ Please reply to an image or video to make a sticker.' });
            return;
        }

        const tempInput = path.join(__dirname, `../../../temp_${Date.now()}.input`);
        const tempOutput = path.join(__dirname, `../../../temp_${Date.now()}.webp`);

        try {
            fs.writeFileSync(tempInput, buffer);

            await new Promise<void>((resolve, reject) => {
                ffmpeg(tempInput)
                    .inputOptions(['-y'])
                    .complexFilter([
                        'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
                    ])
                    .outputOptions([
                        '-vcodec', 'libwebp',
                        '-lossless', '1',
                        '-loop', '0',
                        '-preset', 'default',
                        '-an',
                        '-vsync', '0',
                        '-s', '512x512'
                    ])
                    .save(tempOutput)
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err));
            });

            const stickerBuffer = fs.readFileSync(tempOutput);
            await sock.sendMessage(remoteJid, { sticker: stickerBuffer });

        } catch (error) {
            logger.error({ err: error }, 'Error creating sticker');
            await sock.sendMessage(remoteJid, { text: '❌ Error creating sticker.' });
        } finally {
            if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
            if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        }
    }
};

export default sticker;
