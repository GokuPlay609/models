import { extractText } from '@/utils/messageUtils';
import { WAMessage } from '@whiskeysockets/baileys';

describe('extractText', () => {
    it('should extract text from conversation', () => {
        const msg: WAMessage = {
            key: {},
            message: { conversation: 'Hello' },
        };
        expect(extractText(msg)).toBe('Hello');
    });

    it('should extract text from extendedTextMessage', () => {
        const msg: WAMessage = {
            key: {},
            message: { extendedTextMessage: { text: 'Hello Extended' } },
        };
        expect(extractText(msg)).toBe('Hello Extended');
    });

    it('should extract caption from imageMessage', () => {
        const msg: WAMessage = {
            key: {},
            message: { imageMessage: { caption: 'Image Caption' } },
        };
        expect(extractText(msg)).toBe('Image Caption');
    });

    it('should return empty string if no text found', () => {
        const msg: WAMessage = {
            key: {},
            message: {},
        };
        expect(extractText(msg)).toBe('');
    });
});
