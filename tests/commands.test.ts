import help from '@/commands/general/help';
import { commands } from '@/handlers/commandHandler';
import { WAMessage, WASocket } from '@whiskeysockets/baileys';

// Mock types
const mockSocket = {
    sendMessage: jest.fn(),
} as unknown as WASocket;

describe('Help Command', () => {
    beforeAll(() => {
        // Populate commands map
        commands.set('help', help);
        commands.set('test', {
            name: 'test',
            description: 'A test command',
            category: 'test',
            execute: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should list all commands when no args provided', async () => {
        const msg = {
            key: { remoteJid: '123@s.whatsapp.net' },
            message: { conversation: '.help' },
        } as WAMessage;

        await help.execute(mockSocket, msg, []);

        expect(mockSocket.sendMessage).toHaveBeenCalledWith(
            '123@s.whatsapp.net',
            expect.objectContaining({
                text: expect.stringContaining('*🤖 WhatsApp UserBot Menu*'),
            }),
        );
        expect(mockSocket.sendMessage).toHaveBeenCalledWith(
            '123@s.whatsapp.net',
            expect.objectContaining({
                text: expect.stringContaining('test - A test command'),
            }),
        );
    });

    it('should show details for a specific command', async () => {
        const msg = {
            key: { remoteJid: '123@s.whatsapp.net' },
            message: { conversation: '.help test' },
        } as WAMessage;

        await help.execute(mockSocket, msg, ['test']);

        expect(mockSocket.sendMessage).toHaveBeenCalledWith(
            '123@s.whatsapp.net',
            expect.objectContaining({
                text: expect.stringContaining('*Command:* test'),
            }),
        );
        expect(mockSocket.sendMessage).toHaveBeenCalledWith(
            '123@s.whatsapp.net',
            expect.objectContaining({
                text: expect.stringContaining('*Description:* A test command'),
            }),
        );
    });
});
